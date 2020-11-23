import React, { useState } from "react";

export default function WorkoutDay({
  handleDelete,
  name,
  sets,
  reps,
  rpe,
  notes,
}) {
  const [setsInput, setSets] = useState(sets);
  const [repsInput, setReps] = useState(reps);
  const [RPEInput, setRPE] = useState(rpe);

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  return (
    <div className="workout-plan-exercise workout-plan-exercise-table">
      <p className="workout-plan-delete" onClick={handleDelete}>
        X
      </p>
      <div className="workout-exercise">
        <div className="workout-instructionVideo"></div>
        <p className="workout-exercise-name">{name}</p>
      </div>
      <input
        className="workout-exercise-sets"
        type="number"
        onChange={(e) => setSets(e.currentTarget.value)}
        value={setsInput}
        maxLength="2"
        placeholder="..."
        onInput={maxLengthCheck}
        required
      />
      <input
        className="workout-exercise-reps"
        type="number"
        onChange={(e) => setReps(e.currentTarget.value)}
        value={repsInput}
        maxLength="3"
        placeholder="..."
        onInput={maxLengthCheck}
        required
      />
      <input
        onChange={(e) => setRPE(e.currentTarget.value)}
        className="workout-exercise-rpe"
        type="number"
        maxLength="2"
        placeholder="..."
        onInput={maxLengthCheck}
        value={RPEInput}
        required
      />
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
