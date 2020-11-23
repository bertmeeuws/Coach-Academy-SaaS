import React, { useState } from "react";
import WorkoutTableHeader from "../WorkoutTableHeader/WorkoutTableHeader";
import WorkoutDay from "../WorkoutDay/WorkoutDay";

export default function WorkoutDayPlan({
  handleDelete,
  day,
  setSelectedDay,
  selected,
  dayTitle,
}) {
  const [dayName, setDayName] = useState("");

  return (
    <>
      <div className="workout-plan-day">
        <p>{day} - </p>
        <input
          placeholder="Workout name"
          value={dayName}
          onChange={(e) => {
            setDayName(e.currentTarget.value);
            dayTitle(e.currentTarget.value, day);
          }}
          required
          type="text"
        />
      </div>
      <WorkoutTableHeader />
      <WorkoutDay
        name="Bench press"
        sets="5"
        reps="5"
        rpe="8"
        handleDelete={handleDelete}
      />

      <div
        onClick={(e) => setSelectedDay(day)}
        className={`workout-day-draganddrop ${
          selected === day ? "  workout-plan-day--selected" : ""
        }`}
      >
        Click to add items here
      </div>
    </>
  );
}
