import React from "react";
import style from "./ExerciseItem.module.css";

export default function ExerciseItem({ info, onClick }) {
  const { name, secondary_muscles, muscle, id } = info;

  return (
    <div onClick={(e) => onClick(info)} className={style.exercise}>
      <p className={style.name}>{name}</p>
      <p className={style.primary}>Primary muscle: {muscle.name}</p>
      <p className={style.secondary}>
        Secondary muscles:
        {secondary_muscles
          ? secondary_muscles.map((muscle) => muscle.name)
          : ""}
      </p>
    </div>
  );
}
