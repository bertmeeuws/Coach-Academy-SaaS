import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams, Link, Redirect } from "react-router-dom";
import WorkoutDayPlan from "../../components/WorkoutDayPlan/WorkoutDayPlan";
import ExerciseItem from "../../components/ExerciseItem/ExerciseItem";
import Breadcrumb from "../../assets/images/breadcrumbs.png";
import { v4 as uuidv4 } from "uuid";
import { useLocalStore, action } from "easy-peasy";

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

const INSERT_WORKOUTPLAN = gql`
  mutation InsertWorkoutPlan($object: workout_plan_insert_input!) {
    insert_workout_plan_one(object: $object) {
      id
    }
  }
`;

const INSERT_WORKOUT = gql`
  mutation InsertWorkout($object: workout_insert_input!) {
    insert_workout_one(object: $object) {
      id
    }
  }
`;
const INSERT_EXERCISE_IN_WORKOUT = gql`
  mutation InsertExerciseInWorkout($object: exercise_in_workout_insert_input!) {
    insert_exercise_in_workout_one(object: $object) {
      id
    }
  }
`;

export default function Workout() {
  const { id } = useParams();

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

  const [state, actions] = useLocalStore(() => ({
    selectedDay: "Monday",

    setSelectedDay: action((_state, payload) => {
      _state.selectedDay = payload;
    }),
    addExerciseToDay: action((_state, payload) => {
      console.log(payload);
      _state.Workouts[_state.selectedDay].exercises.push(payload);
    }),
    setDayTitle: action((_state, payload) => {
      _state.Workouts[payload.day].name = payload.name;
    }),
    setReps: action((_state, payload) => {
      //find item in array
      console.log(payload);
      _state.Workouts[payload.day].exercises.map((item) =>
        item.unique === payload.unique ? (item.reps = payload.value) : item
      );
    }),
    setRpe: action((_state, payload) => {
      //find item in array
      console.log(payload);
      _state.Workouts[payload.day].exercises.map((item) =>
        item.unique === payload.unique ? (item.rpe = payload.value) : item
      );
    }),
    setSets: action((_state, payload) => {
      //find item in array
      console.log(payload);
      _state.Workouts[payload.day].exercises.map((item) =>
        item.unique === payload.unique ? (item.sets = payload.value) : item
      );
    }),
    clearFields: action((_state, payload) => {
      Object.values(_state.Workouts).forEach((day) => {
        day.name = "";
        day.exercises = [];
      });
    }),
    Workouts: {
      Monday: {
        day: "Monday",
        name: "",
        exercises: [],
      },
      Tuesday: {
        day: "Tuesday",
        name: "",
        exercises: [],
      },
      Wednesday: {
        day: "Wednesday",
        name: "",
        exercises: [],
      },
      Thursday: {
        day: "Thursday",
        name: "",
        exercises: [],
      },
      Friday: {
        day: "Friday",
        name: "",
        exercises: [],
      },
      Saturday: {
        day: "Saturday",
        name: "",
        exercises: [],
      },
      Sunday: {
        day: "Sunday",
        name: "",
        exercises: [],
      },
    },
  }));

  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);

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

  const { loading, errors } = clientQuery;

  const [insertWorkoutPlan] = useMutation(INSERT_WORKOUTPLAN);

  const [insertWorkout] = useMutation(INSERT_WORKOUT);

  const [insertExerciseInWorkout] = useMutation(INSERT_EXERCISE_IN_WORKOUT);

  if (errors) {
    console.error(errors);
    return <Redirect to="/clients"></Redirect>;
  }

  if (loading) {
    return <p>Loading</p>;
  }

  const handleDelete = () => {};

  const searchExercises = async () => {
    const { data } = await getExercises;
    if (data) {
      setExercises(data.exercise);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //Add to database
    let idWorkoutplan;
    try {
      const { data } = await insertWorkoutPlan({
        variables: {
          object: {
            client_id: id,
            coach_id: 15,
            expiry_date: "2020-11-25",
          },
        },
      });
      console.log("Workout plan inserted");
      console.log(data.insert_workout_plan_one.id);
      idWorkoutplan = data.insert_workout_plan_one.id;
    } catch (errors) {
      console.log("Error in workout plan");
    }
    //Start adding the days
    await Object.values(state.Workouts).forEach(async (day, index) => {
      let workoutId;
      try {
        const { data } = await insertWorkout({
          variables: {
            object: {
              day: day.day,
              title: day.name,
              workout_plan_id: idWorkoutplan,
              order: index,
            },
          },
        });
        console.log(data);
        workoutId = data.insert_workout_one.id;
      } catch (errors) {
        console.log(errors);
      }
      await day.exercises.forEach(async (exercise) => {
        try {
          const { data } = await insertExerciseInWorkout({
            variables: {
              object: {
                rpe: exercise.rpe,
                sets: exercise.sets,
                reps: exercise.reps,
                unique_id: exercise.unique,
                exercise_id: exercise.id,
                workout_id: workoutId,
                
              },
            },
          });
          console.log(data);
        } catch (errors) {
          console.log(errors);
        }
      });
    });
  };

  const addExercise = (data) => {
    actions.addExerciseToDay(exercise(data.id, data.name));
    console.log("Exercise added");
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
        <Link className="client-workout-breadcrumbs--link">
          Add workout plan
        </Link>
      </div>
      <div className="client-workout-grid">
        <article className="workout-plan rounded shadow">
          <form onSubmit={handleFormSubmit}>
            <h2 className="hidden">Weekly workout plan</h2>
            <WorkoutDayPlan
              setSelectedDay={(day) => actions.setSelectedDay(String(day))}
              selected={state.selectedDay}
              day="Monday"
              data={state.Workouts.Monday}
              dayTitle={(name, day) => actions.setDayTitle({ day, name })}
              handleDelete={handleDelete}
              setSets={(value, day, unique) =>
                actions.setSets({ value, day, unique })
              }
              setReps={(value, day, unique) =>
                actions.setReps({ value, day, unique })
              }
              setRpe={(value, day, unique) =>
                actions.setRpe({ value, day, unique })
              }
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => actions.setSelectedDay(String(day))}
              selected={state.selectedDay}
              day="Tuesday"
              data={state.Workouts.Tuesday}
              dayTitle={(name, day) => actions.setDayTitle({ day, name })}
              handleDelete={handleDelete}
              setSets={(value, day, unique) =>
                actions.setSets({ value, day, unique })
              }
              setReps={(value, day, unique) =>
                actions.setReps({ value, day, unique })
              }
              setRpe={(value, day, unique) =>
                actions.setRpe({ value, day, unique })
              }
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => actions.setSelectedDay(String(day))}
              selected={state.selectedDay}
              day="Wednesday"
              data={state.Workouts.Wednesday}
              dayTitle={(name, day) => actions.setDayTitle({ day, name })}
              handleDelete={handleDelete}
              setSets={(value, day, unique) =>
                actions.setSets({ value, day, unique })
              }
              setReps={(value, day, unique) =>
                actions.setReps({ value, day, unique })
              }
              setRpe={(value, day, unique) =>
                actions.setRpe({ value, day, unique })
              }
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => actions.setSelectedDay(String(day))}
              selected={state.selectedDay}
              day="Thursday"
              data={state.Workouts.Thursday}
              dayTitle={(name, day) => actions.setDayTitle({ day, name })}
              handleDelete={handleDelete}
              setSets={(value, day, unique) =>
                actions.setSets({ value, day, unique })
              }
              setReps={(value, day, unique) =>
                actions.setReps({ value, day, unique })
              }
              setRpe={(value, day, unique) =>
                actions.setRpe({ value, day, unique })
              }
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => actions.setSelectedDay(String(day))}
              selected={state.selectedDay}
              day="Friday"
              data={state.Workouts.Friday}
              dayTitle={(name, day) => actions.setDayTitle({ day, name })}
              handleDelete={handleDelete}
              setSets={(value, day, unique) =>
                actions.setSets({ value, day, unique })
              }
              setReps={(value, day, unique) =>
                actions.setReps({ value, day, unique })
              }
              setRpe={(value, day, unique) =>
                actions.setRpe({ value, day, unique })
              }
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => actions.setSelectedDay(String(day))}
              selected={state.selectedDay}
              day="Saturday"
              data={state.Workouts.Saturday}
              dayTitle={(name, day) => actions.setDayTitle({ day, name })}
              handleDelete={handleDelete}
              setSets={(value, day, unique) =>
                actions.setSets({ value, day, unique })
              }
              setReps={(value, day, unique) =>
                actions.setReps({ value, day, unique })
              }
              setRpe={(value, day, unique) =>
                actions.setRpe({ value, day, unique })
              }
            />
            <WorkoutDayPlan
              setSelectedDay={(day) => actions.setSelectedDay(String(day))}
              selected={state.selectedDay}
              day="Sunday"
              data={state.Workouts.Sunday}
              dayTitle={(name, day) => actions.setDayTitle({ day, name })}
              handleDelete={handleDelete}
              setSets={(value, day, unique) =>
                actions.setSets({ value, day, unique })
              }
              setReps={(value, day, unique) =>
                actions.setReps({ value, day, unique })
              }
              setRpe={(value, day, unique) =>
                actions.setRpe({ value, day, unique })
              }
            />
            <input className="client-workout-button shadow" type="submit" />
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
