import React, { useState, useEffect } from "react";
import WorkoutTableHeader from "../WorkoutTableHeader/WorkoutTableHeader";
import WorkoutDay from "../WorkoutDay/WorkoutDay";
import { ReactMic } from "react-mic";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function WorkoutDayPlan({
  handleDelete,
  day,
  setSelectedDay,
  selected,
  dayTitle,
  data,
  setSets,
  setReps,
  setRpe,
  setNotes,
}) {
  const [dayName, setDayName] = useState("");

  const [record, setRecord] = useState(false);

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onData = (recordedBlob) => {
    //console.log("chunk of real-time data is: ", recordedBlob);
  };

  const onStop = async (recordedBlob) => {
    //console.log("recordedBlob is: ", recordedBlob);

    await uploadAudio(recordedBlob);
  };

  const uploadAudio = async (file) => {
    console.log(file);
    const form_data = new FormData();
    form_data.append("files", file);

    const response = await axios.post(
      `http://host.docker.internal:3001/storage/audioupload`,
      form_data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-path": "/upload-folder",
        },
        withCredentials: true,
      }
    );

    console.log({ response });
  };

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
      {data.exercises.map((exercise) => (
        <WorkoutDay
          name={exercise.name}
          sets={exercise.sets}
          setSets={(value) => setSets(value, day, exercise.unique)}
          reps={exercise.reps}
          setReps={(value) => setReps(value, day, exercise.unique)}
          rpe={exercise.rpe}
          setRpe={(value) => setRpe(value, day, exercise.unique)}
          handleDelete={() => handleDelete(day, exercise.unique)}
          notes={exercise.notes}
          setNotes={(value) => setNotes(value, day, exercise.unique)}
        />
      ))}

      <div
        onClick={() => setSelectedDay(day)}
        className={`workout-day-draganddrop ${
          selected === day ? "  workout-plan-day--selected" : ""
        }`}
      >
        Click to add items here
      </div>
    </>
  );
}
