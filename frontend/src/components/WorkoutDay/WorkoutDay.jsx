import React, { useState } from "react";

export default function WorkoutDay({
  handleDelete,
  name,
  sets,
  reps,
  rpe,
  notes,
  setRpe,
  setSets,
  setReps,
  setNotes,
}) {
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  const [edit, setEdit] = useState(false);

  console.log(edit);

  return (
    <div className="workout-plan-exercise workout-plan-exercise-table">
      <p className="workout-plan-delete" onClick={(e) => handleDelete()}>
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
        value={sets}
        maxLength="2"
        placeholder="..."
        onInput={maxLengthCheck}
        required
      />
      <input
        className="workout-exercise-reps"
        type="number"
        onChange={(e) => setReps(e.currentTarget.value)}
        value={reps}
        maxLength="3"
        placeholder="..."
        onInput={maxLengthCheck}
        required
      />
      <input
        onChange={(e) => setRpe(e.currentTarget.value)}
        className="workout-exercise-rpe"
        type="number"
        maxLength="2"
        placeholder="..."
        onInput={maxLengthCheck}
        value={rpe}
        required
      />
      <div className="workout-plan-notes">
        <button
          onClick={() => setEdit(!edit)}
          className="workout-exercise-memo"
        >
          Notes
        </button>
        <button className="workout-exercise-memo">Record</button>
      </div>
      {edit === true ? (
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          className="workout-exercise-notes smalltext"
          placeholder="Type here..."
        />
      ) : (
        ""
      )}
    </div>
  );
}
