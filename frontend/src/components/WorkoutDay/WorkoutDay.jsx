import React from "react";

export default function WorkoutDay({
  handleDelete,
  name,
  sets,
  reps,
  rpe,
  notes,
}) {
  return (
    <div className="workout-plan-exercise workout-plan-exercise-table">
      <p className="workout-plan-delete" onClick={handleDelete}>
        X
      </p>
      <div className="workout-exercise">
        <div className="workout-instructionVideo"></div>
        <p className="workout-exercise-name">{name}</p>
      </div>
      <p className="workout-exercise-sets">{sets}</p>
      <p className="workout-exercise-reps">{reps}</p>
      <p className="workout-exercise-rpe">{rpe}</p>
      <button className="workout-exercise-memo">Record</button>
      <p className="workout-exercise-notes smalltext">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus nec
        ligula non sagittis. Fusce efficitur magna ligula. Vestibulum porttitor,
        magna eu scelerisque malesuada, nibh augue egestas justo, et aliquam dui
        mi at justo. Vestibulum at est posuere, venenatis neque a, commodo
        nulla.
      </p>
    </div>
  );
}
