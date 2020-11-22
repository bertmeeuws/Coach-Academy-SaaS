import React, { useState } from "react";
import { useSubscription, gql } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import WorkoutDayPlan from "../../components/WorkoutDayPlan/WorkoutDayPlan";

const CLIENT_QUERY = gql`
  query GetClientData($id: Int!) @cached {
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

export default function Workout() {
  const { id } = useParams();

  const [monday, setMonday] = useState([]);

  const clientQuery = useSubscription(CLIENT_QUERY, {
    variables: {
      id: id,
    },
  });

  const { data, loading, errors } = clientQuery;

  if (errors) {
    console.error(errors);
  }

  if (loading) {
    return <p>Loading</p>;
  }
  if (data) {
    console.log(data);
  }
  const handleDelete = () => {
    alert("Delete");
  };

  return (
    <section className="client-workout">
      <h1 className="hidden">Client workout</h1>
      <div className="client-workout-breadcrumbs">
        <Link>All clients</Link> <Link>Client file Maxime Vercruysse</Link>{" "}
        <Link>Workout plan</Link>
      </div>
      <article className="workout-plan rounded shadow">
        <h2 className="hidden">Weekly workout plan</h2>
        <WorkoutDayPlan day="Monday" handleDelete={handleDelete} />
        <WorkoutDayPlan day="Tuesday" handleDelete={handleDelete} />
      </article>
    </section>
  );
}
