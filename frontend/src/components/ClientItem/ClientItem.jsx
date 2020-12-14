import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Dummy from "../../assets/images/profile1.jpg";

const GENERATE_LINK = gql`
  mutation MyQuery($key: String!) {
    getS3ImageUrl(key: $key) {
      viewingLink
    }
  }
`;

export default function ClientItem({ onClick, surname, name, id, avatar }) {
  const [GET_IMAGES] = useMutation(GENERATE_LINK);

  const [pic, setPic] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const { data, errors } = await GET_IMAGES({
        variables: {
          key: avatar.key,
        },
      });
      console.log(data);
      if (!errors) {
        setPic(data.getS3ImageUrl.viewingLink);
      } else {
        setPic(null);
      }
    }
    fetchData();
  }, []);

  console.log(pic);

  if (pic === undefined) {
    return <></>;
  }

  return (
    <div onClick={onClick} data-id={id} className="clientItem rounded shadow">
      <div className="clientItem-container">
        <div className="clientItem-circle">
          <img
            height="40"
            width="40"
            src={pic === null ? Dummy : pic}
            alt="Profile"
          />
        </div>
        <p className="normaltext">
          {surname} {name}
        </p>
      </div>
      <div className="clientItem-container">
        <p className="normaltext">Active</p>
      </div>
    </div>
  );
}
