import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, Link, Redirect } from "react-router-dom";
import WorkoutDayPlan from "../../components/WorkoutDayPlan/WorkoutDayPlan";
import ExerciseItem from "../../components/ExerciseItem/ExerciseItem";
import Breadcrumb from "../../assets/images/breadcrumbs.png";
import { v4 as uuidv4 } from "uuid";

const CLIENT_QUERY = gql`
  query GetClientData($id: Int!) @cached(ttl: 120) {
    client(where: { id: { _eq: $id } }, limit: 1) {
      address
      city
      dob
      email
      height
      id
      name
      phone
      profession
      surname
      postal
      weight
    }
  }
`;

const EXERCISE_API = gql`
  query FindExercises($name: String) {
    exercise(where: { name: { _ilike: $name } }, limit: 8) {
      id
      name
      muscle {
        name
      }
      secondary_muscles(where: { exercise: { name: { _ilike: $name } } }) {
        muscle {
          name
        }
      }
    }
  }
`;

export default function Workout() {
  const { id } = useParams();

  const header = () => {
    return {
      day: "",
      name: "",
    };
  };

  const exercise = (
    id,
    name = "",
    sets = 1,
    reps = 10,
    rpe = 8,
    notes = ""
  ) => {
    return {
      id: id,
      name: name,
      sets: sets,
      reps: reps,
      rpe: rpe,
      notes: notes,
      unique: uuidv4(),
    };
  };

  //Template
  //console.log({ exercises: [exercise()], ...header });

  let template = { exercises: [], ...header };

  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [monday, setMonday] = useState({
    ...template,
    day: "Monday",
    name: "",
  });
  const [tuesday, setTuesday] = useState({
    ...template,
    day: "Tuesday",
    name: "",
  });
  const [wednesday, setWednesday] = useState({
    ...template,
    day: "Wednesday",
    name: "",
  });
  const [thursday, setThursday] = useState({
    ...template,
    day: "Thursday",
    name: "",
  });
  const [friday, setFriday] = useState({
    ...template,
    day: "Friday",
    name: "",
  });
  const [saturday, setSaturday] = useState({
    ...template,
    day: "Saturday",
    name: "",
  });
  const [sunday, setSunday] = useState({
    ...template,
    day: "Sunday",
    name: "",
  });

  const clientQuery = useQuery(CLIENT_QUERY, {
    variables: {
      id: id,
    },
  });

  const getExercises = useQuery(EXERCISE_API, {
    variables: {
      name: search === "" ? `% %` : `%${search}%`,
    },
  });

  const { data, loading, errors } = clientQuery;

  if (loading) {
    if (data) {
      console.log(data);
    }
  }

  if (errors) {
    console.error(errors);
    return <Redirect to="/clients"></Redirect>;
  }

  if (loading) {
    return <p>Loading</p>;
  }

  const handleDelete = () => {};

  const searchExercises = async () => {
    const { data, loading, errors } = await getExercises;
    if (data) {
      setExercises(data.exercise);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const addExercise = (data) => {
    switch (selectedDay) {
      case "Monday":
        {
          const clone = Object.assign({}, monday);
          clone.exercises.push(exercise(data.id, data.name));
          setMonday(clone);

          console.log(monday);
        }
        break;

      case "Tuesday":
        {
          const clone2 = Object.assign({}, tuesday);
          clone2.exercises.push(exercise(data.id, data.name));
          setTuesday(clone2);
          console.log(tuesday);
        }
        break;

      case "Wednesday":
        setWednesday(
          wednesday,
          wednesday.exercises.push(exercise(data.id, data.name))
        );
        console.log(wednesday);
        break;

      case "Thursday":
        setThursday(
          thursday,
          thursday.exercises.push(exercise(data.id, data.name))
        );
        console.log(thursday);
        break;

      case "Friday":
        setFriday(friday, friday.exercises.push(exercise(data.id, data.name)));
        console.log(friday);
        break;

      case "Saturday":
        setSaturday(
          saturday,
          saturday.exercises.push(exercise(data.id, data.name))
        );
        console.log(saturday);
        break;

      case "Sunday":
        setSunday(sunday, sunday.exercises.push(exercise(data.id, data.name)));
        console.log(sunday);
        break;
    }
  };

  const setWorkoutTitle = (name, day) => {
    switch (day) {
      case "Monday":
        setMonday(monday, (monday.name = name));

        break;

      case "Tuesday":
        setTuesday(tuesday, (tuesday.name = name));

        break;

      case "Wednesday":
        setWednesday(wednesday, (wednesday.name = name));

        break;

      case "Thursday":
        setThursday(thursday, (thursday.name = name));

        break;

      case "Friday":
        setFriday(friday, (friday.name = name));

        break;

      case "Saturday":
        setSaturday(saturday, (saturday.name = name));

        break;

      case "Sunday":
        setSunday(sunday, (sunday.name = name));

        break;
    }
  };

  return (
    <section className="client-workout">
      <h1 className="hidden">Client workout</h1>
      <div className="client-workout-breadcrumbs">
        <Link className="client-workout-breadcrumbs--link" to="/clients">
          All clients
        </Link>
        <img className="client-workout-breadcrumbs-icon" src={Breadcrumb}></img>
        <Link className="client-workout-breadcrumbs--link" to={"/client/" + id}>
          Maxime Vercruysse
        </Link>{" "}
        <img className="client-workout-breadcrumbs-icon" src={Breadcrumb}></img>
        <Link className="client-workout-breadcrumbs--link">Workout plan</Link>
      </div>
      <div className="client-workout-grid">
        <article className="workout-plan rounded shadow">
          <form onSubmit={handleFormSubmit}>
            <h2 className="hidden">Weekly workout plan</h2>
            <WorkoutDayPlan
              setSelectedDay={(day) => setSelectedDay(day)}
              selected={selectedDay}
              day="Monday"
              data={monday}
              dayTitle={setWorkoutTitle}
              handleDelete={handleDelete}
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => setSelectedDay(day)}
              selected={selectedDay}
              day="Tuesday"
              data={tuesday}
              dayTitle={setWorkoutTitle}
              handleDelete={handleDelete}
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => setSelectedDay(day)}
              selected={selectedDay}
              day="Wednesday"
              data={wednesday}
              dayTitle={setWorkoutTitle}
              handleDelete={handleDelete}
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => setSelectedDay(day)}
              selected={selectedDay}
              day="Thursday"
              data={thursday}
              dayTitle={setWorkoutTitle}
              handleDelete={handleDelete}
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => setSelectedDay(day)}
              selected={selectedDay}
              day="Friday"
              data={friday}
              dayTitle={setWorkoutTitle}
              handleDelete={handleDelete}
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => setSelectedDay(day)}
              selected={selectedDay}
              day="Saturday"
              data={saturday}
              dayTitle={setWorkoutTitle}
              handleDelete={handleDelete}
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => setSelectedDay(day)}
              selected={selectedDay}
              day="Sunday"
              data={sunday}
              dayTitle={setWorkoutTitle}
              handleDelete={handleDelete}
            />
            <input type="submit" />
          </form>
        </article>
        <article className="workout-exercises rounded shadow">
          <form>
            <input
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                searchExercises();
              }}
              name="searchExercises"
              placeholder="Search"
              value={search}
              type="text"
            />
          </form>

          {exercises ? (
            exercises.map((item) => (
              <ExerciseItem onClick={addExercise} info={item} />
            ))
          ) : (
            <p>No items</p>
          )}
        </article>
      </div>
    </section>
  );
}
