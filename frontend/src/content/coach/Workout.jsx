import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, Link, Redirect } from "react-router-dom";
import WorkoutDayPlan from "../../components/WorkoutDayPlan/WorkoutDayPlan";
import ExerciseItem from "../../components/ExerciseItem/ExerciseItem";
import Breadcrumb from "../../assets/images/breadcrumbs.png";

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

  const [search, setSearch] = useState("");
  const [monday, setMonday] = useState([]);
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
  /*
  useEffect(async () => {
    const { data, loading, errors } = await getExercises;
    exercises = data.exercise;
    if (errors) {
      console.error(errors);
    }
    console.log(exercises);
  }, []);
*/
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
    setExercises(data.exercise);
    console.log(exercises);
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
          <h2 className="hidden">Weekly workout plan</h2>
          <WorkoutDayPlan day="Monday" handleDelete={handleDelete} />
          <WorkoutDayPlan day="Tuesday" handleDelete={handleDelete} />
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
            exercises.map((item) => <ExerciseItem info={item} />)
          ) : (
            <p>No items</p>
          )}
        </article>
      </div>
    </section>
  );
}
