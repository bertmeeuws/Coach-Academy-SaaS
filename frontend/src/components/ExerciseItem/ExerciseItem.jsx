import React from "react";
import style from "./ExerciseItem.module.css";

export default function ExerciseItem({ info }) {
  const { name, secondary_muscles, muscle } = info;

  return (
    <div className={style.exercise}>
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
