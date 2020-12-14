import React, { useState, useEffect } from "react";
import style from "../Header/Header.module.css";
import Alarm from "../../assets/images/svg/Alarm.svg";
import Todo from "../../assets/images/svg/Todo.svg";
import { format } from "date-fns";
import { eoLocale } from "date-fns/locale/eo";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useStoreState } from "easy-peasy";
import Dummy from "../../assets/images/profile1.jpg";

const NAME = gql`
  query MyQuery($id: Int!) @cached(ttl: 60) {
    coach(where: { user_id: { _eq: $id } }) {
      surname
      user {
        avatars(order_by: { id: desc }) {
          key
        }
      }
    }
  }
`;

const GENERATE_LINK = gql`
  mutation MyQuery($key: String!) {
    getS3ImageUrl(key: $key) {
      viewingLink
    }
  }
`;

export default function Header({ title }) {
  const id = useStoreState((state) => state.user_id);
  const [GET_IMAGES] = useMutation(GENERATE_LINK);

  console.log(id);

  const [pic, setPic] = useState(undefined);

  const date = format(new Date(), "dddd, DD MMMM YYYY", {
    locale: eoLocale,
  });

  const { data } = useQuery(NAME, {
    variables: {
      id: id,
    },
  });

  useEffect(async () => {
    async function fetchData() {
      if (data) {
        if (data.coach[0].user.avatars.length !== 0) {
          const { data: response, errors } = await GET_IMAGES({
            variables: {
              key: data.coach[0].user.avatars[0].key,
            },
          });
          console.log(response);
          if (!errors) {
            setPic(response.getS3ImageUrl.viewingLink);
            console.log(response.getS3ImageUrl.viewingLink);
          } else {
            setPic(null);
          }
        } else {
          setPic(null);
        }
      }
    }
    fetchData();
  }, [data]);

  if (data) {
    console.log(data.coach[0].surname);
  }

  return (
    <header className={style.header}>
      <div className={style.content}>
        <div className={style.left}>
          <h1 className={style.title}>{title}</h1>
        </div>
        <div className={style.right}>
          <div className={style.today}>
            <div>{date}</div>
          </div>
          <div className={style.icons}>
            <img src={Alarm} alt="" />
            <img src={Todo} alt="" />
          </div>
          <div className={style.personal}>
            <img
              className={style.pic}
              src={pic === null ? Dummy : pic}
              width="44"
              height="44"
              alt=""
            />
            <p className={style.name}>
              Coach <span>{data ? data.coach[0].surname : ""}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
