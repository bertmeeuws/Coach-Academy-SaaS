import React from "react";
import style from "../Header/Header.module.css";
import Alarm from "../../assets/images/svg/Alarm.svg";
import Todo from "../../assets/images/svg/Todo.svg";
import Me from "../../assets/images/svg/Me.png";
import { format } from "date-fns";
import { eoLocale } from "date-fns/locale/eo";
import { gql, useQuery } from "@apollo/client";
import { useStoreState } from "easy-peasy";

const NAME = gql`
  query MyQuery($id: Int!) {
    coach(where: { user_id: { _eq: $id } }) {
      surname
    }
  }
`;

export default function Header({ title }) {
  const id = useStoreState((state) => state.user_id);

  console.log(id);

  const date = format(new Date(), "dddd, DD MMMM YYYY", {
    locale: eoLocale,
  });

  const { data, error } = useQuery(NAME, {
    variables: {
      id: id,
    },
  });
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
            <img className={style.pic} src={Me} width="44" height="44" alt="" />
            <p className={style.name}>
              Coach <span>{data ? data.coach[0].surname : ""}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
