import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSubscription, gql } from "@apollo/client";
import "../../styles/client_document.css";

const GET_CLIENT_DATA = gql`
  query GetClientData($id: Int!) @cached(ttl: 120) {
    client(limit: 1, where: { id: { _eq: $id } }) {
      weight
      user_id
      surname
      profession
      postal
      phone
      name
      id
      height
      email
      dob
      city
      address
    }
  }
`;

export default function Client() {
  const { id } = useParams();

  const request = useSubscription(GET_CLIENT_DATA, {
    variables: {
      id: id,
    },
  });

  const { data, loading } = request;

  let client = undefined;

  if (loading) {
    return <p>Loading data</p>;
  }
  if (data) {
    client = data.client[0];
  }

  return (
    <section className="client client-grid">
      <h1 className="hidden">Client document</h1>
      <article className="client-stats padding  rounded shadow">
        <h1 className="client-stats-title subtitle">Client stats</h1>
        <button className="button-viewPhotos shadow">View photos</button>
        <div className="client-stats-information">
          <p>92.1kg</p>
          <p>Starting weight</p>
          <p>90.1kg</p>
          <p>Last weigh in</p>
          <p>-0.08kg</p>
          <p>Avg. weight lost/gained per week</p>
          <p>2800</p>
          <p>Calories per day</p>
          <p>5604</p>
          <p>Avg. steps per day</p>
        </div>
        <div className="client-stats-pics"></div>
      </article>
      <div className="client-buttons">
        <Link
          className="client-button rounded shadow"
          to={`${data.client[0].id}/workout`}
        >
          <article className="client-workoutplan">
            <h1 className="client-workout-button">Workout plan</h1>
          </article>
        </Link>
        <Link
          className="client-button rounded shadow"
          to={`${data.client[0].id}/diet`}
        >
          <article className="client-diet-button">
            <h1 className="client-diet-button">Diet plan</h1>
          </article>
        </Link>
      </div>
      <article className="client-sidebar padding rounded shadow">
        <h1 className="hidden">Client information</h1>
        <div className="client-img"></div>
        <p className="client-name">
          {client.surname} {client.name}
        </p>
        <p>{client.dob}</p>
        <button>More button</button>
        <p className="smalltext">Address</p>
        <p>{client.address}</p>
        <p className="smalltext">Postcode</p>
        <p>{client.postal}</p>
        <p className="smalltext">Gemeente</p>
        <p>{client.city}</p>
        <p className="smalltext">Leeftijd</p>
        <p>20 Jaar</p>
        <p className="smalltext">Height</p>
        <p>{client.height}cm</p>
        <p className="smalltext">Profession</p>
        <p>{client.profession}</p>
        <p className="smalltext">BMI</p>
        <p>24.1</p>
        <p className="smalltext">Contact gegevens</p>
        <p>{client.email}</p>
        <p>{client.phone}</p>
      </article>
    </section>
  );
}
