import React, { useState } from "react";
import style from "./index.module.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LoaderSmall } from "./../Loaders/Loaders";
import { useStoreState } from "easy-peasy";

const GET_ALL_COACHES = gql`
  query MyQuery {
    coach {
      id
      surname
      name
    }
  }
`;

const SET_NEW_COACH = gql`
  mutation MyMutation($id: Int!, $coach_id: Int!) {
    update_client(
      where: { user_id: { _eq: $id } }
      _set: { coach_id: $coach_id }
    ) {
      affected_rows
    }
  }
`;

export default function CoachPopup() {
  const { data } = useQuery(GET_ALL_COACHES);

  const [INSERT_COACH] = useMutation(SET_NEW_COACH);

  const stateId = useStoreState((state) => state.user_id);

  const [selected, setSelected] = useState("");

  console.log(selected);

  if (!data) {
    return <LoaderSmall />;
  }
  if (data) {
    console.log(data);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { data } = await INSERT_COACH({
      variables: {
        id: stateId,
        coach_id: selected,
      },
    });
    console.log(data);
  };

  return (
    <div className={style.box}>
      <p>Change your coach</p>
      <form onSubmit={handleFormSubmit} className={style.form}>
        <select
          value={selected}
          required
          onChange={(e) => setSelected(e.currentTarget.value)}
          name="coaches"
          id="coaches"
        >
          <option value="" disabled selected>
            Select your option
          </option>
          {data.coach.map((coach) => {
            return (
              <option key={coach.id} value={coach.id}>
                {coach.surname} {coach.name}
              </option>
            );
          })}
        </select>
        <button className={style.button} type="submit">
          Add coach
        </button>
      </form>
    </div>
  );
}
