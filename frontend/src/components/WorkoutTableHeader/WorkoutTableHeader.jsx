import React from "react";

export default function WorkoutTableHeader() {
  return (
    <div className="workout-table-header">
      <p></p>
      <p className="smalltext exercise">Exercise</p>
      <p className="smalltext sets">Sets</p>
      <p className="smalltext reps">Reps</p>
      <p className="smalltext reps">RPE</p>
      <p className="smalltext notes">Notes</p>
    </div>
  );
}
