import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import "../../styles/client_document.css";
import Dummy from "../../assets/images/profile1.jpg";
import Email from "../../assets/images/email.png";
import Phone from "../../assets/images/phone.png";
import { Line, Bar } from "react-chartjs-2";
import { LoaderLarge } from "../../components/Loaders/Loaders";

const GET_CLIENT_DATA = gql`
  query GetClientData($id: Int!) {
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
      user {
        avatars(order_by: { id: desc }, limit: 1) {
          key
          id
        }
      }
    }
    weight(
      distinct_on: date
      where: { user: { clients: { id: { _eq: $id } } } }
      order_by: { date: asc, created_at: desc }
    ) {
      id
      created_at
      date
      weight
    }
    steps(
      where: { user: { clients: { id: { _eq: $id } } } }
      distinct_on: date
      order_by: { date: asc, created_at: desc }
    ) {
      steps
      date
    }
    survey(
      distinct_on: created_at
      where: { user: { clients: { id: { _eq: $id } } } }
      order_by: { created_at: desc }
      limit: 7
    ) {
      energy_workout
      energy_day
      craving
      created_at
    }
  }
`;

const GENERATE_LINK = gql`
  mutation MyQuery($key: String!) {
    getS3ImageUrl(key: $key) {
      viewingLink
    }
  }
`;

export default function Client() {
  const { id } = useParams();

  const [pic, setPic] = useState(undefined);

  const { data } = useQuery(GET_CLIENT_DATA, {
    variables: {
      id: id,
    },
  });

  const [chart, setChart] = useState("Weight");

  const [GET_IMAGES] = useMutation(GENERATE_LINK);
  // eslint-disable-next-line
  useEffect(() => {
    async function fetch() {
      if (data) {
        if (data.client[0].user.avatars.length !== 0) {
          console.log(data.client[0].user);
          // eslint-disable-next-line
          const { data: response, errors } = await GET_IMAGES({
            variables: {
              key: data.client[0].user.avatars[0].key,
            },
          });
          console.log(response);
          if (!errors) {
            setPic(response.getS3ImageUrl.viewingLink);
          } else {
            setPic(null);
          }
        } else {
          setPic(null);
        }
      }
    }
    // eslint-disable-next-line
    fetch();
    // eslint-disable-next-line
  }, [data]);

  let dataSet = [];
  let labelsSet = [];
  let stepsSet = [];
  let stepsLabel = [];
  let surveySetCravings = [];
  let surveySetEnergyDay = [];
  let surveySetEnergyWorkout = [];
  let surveyLabels = [];

  let client = undefined;

  if (!data) {
    return <LoaderLarge />;
  }
  if (data) {
    client = data.client[0];
    if (data.weight) {
      // eslint-disable-next-line
      data.weight.map((item) => {
        dataSet.push(item.weight);
        labelsSet.push(item.date);
      });
    }
    if (data.steps) {
      // eslint-disable-next-line
      data.steps.map((item) => {
        stepsSet.push(item.steps);
        stepsLabel.push(item.date);
      });
    }
    if (data.survey) {
      // eslint-disable-next-line
      data.survey.map((item) => {
        surveySetCravings.push(item.craving);
        surveySetEnergyDay.push(item.energy_day);
        surveySetEnergyWorkout.push(item.energy_workout);
        surveyLabels.push(item.created_at);
      });
    }
  }

  const WEIGHT_DATA = {
    labels: labelsSet,
    datasets: [
      {
        label: "Weight",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "#f0f4f7",
        borderColor: "#00c49a",
        borderWidth: 4,

        data: dataSet,
      },
    ],
  };

  const STEPS_DATA = {
    labels: stepsLabel,
    datasets: [
      {
        label: "Weight",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "#f0f4f7",
        borderColor: "#00c49a",
        borderWidth: 4,

        data: stepsSet,
      },
    ],
  };

  const SURVEY_DATA = {
    labels: surveyLabels,
    datasets: [
      {
        label: "Cravings",
        data: surveySetCravings,
        backgroundColor: "rgb(0,196,154)",
      },
      {
        label: "Energy during workout",
        data: surveySetEnergyWorkout,
        backgroundColor: "rgb(0, 255, 229)",
      },
      {
        label: "Energy during day",
        data: surveySetEnergyDay,
        backgroundColor: "rgb(79, 255, 190)",
      },
    ],
  };

  if (pic === undefined) {
    return <></>;
  }

  return (
    <section className="client client-grid">
      <h1 className="hidden">Client document</h1>
      <article className="client-stats padding  rounded shadow">
        <h1 className="client-stats-title subtitle">Client stats</h1>
        <Link to={id + `/photos`} className="button-viewPhotos shadow">
          View photos
        </Link>
        <div className="client-stats-information">
          <p className="weight">92.1kg</p>
          <p className="title">Starting weight</p>
          <p className="lastweight">90.1kg</p>
          <p className="title">Last weigh in</p>
          <p className="lostgained">-0.08kg</p>
          <p className="title">Avg. weight lost/gained per week</p>
          <p className="totalcalories">2800</p>
          <p className="title">Calories per day</p>
          <p className="avgcals">5654</p>
          <p className="title">Avg. steps per day</p>
        </div>
        <div className="client-stats-pics">
          <div className="client-stats-nav">
            <p
              onClick={() => setChart("Weight")}
              className={`client-chart-button ${
                chart === "Weight" ? " p-active" : ""
              }`}
            >
              Weight
            </p>
            <p
              onClick={() => setChart("Steps")}
              className={`client-chart-button ${
                chart === "Steps" ? " p-active" : ""
              }`}
            >
              Steps
            </p>
            <p
              onClick={() => setChart("Survey")}
              className={`client-chart-button ${
                chart === "Survey" ? " p-active" : ""
              }`}
            >
              Survey
            </p>
          </div>
          <div
            className={`client-graph-container ${
              chart === "Weight" ? "" : "hidden"
            }`}
          >
            <Line
              data={WEIGHT_DATA}
              height="80"
              options={{
                responsive: true,
                scales: {
                  xAxes: [
                    {
                      type: "time",
                      time: {
                        unit: "day",
                        displayFormats: {
                          millisecond: "MMM D",
                          second: "MMM D",
                          minute: "MMM D",
                          hour: "MMM D",
                          day: "MMM D",
                          week: "MMM D",
                          month: "MMM D",
                          quarter: "MMM D",
                          year: "MMM D",
                        },
                      },
                    },
                  ],
                },
                maintainAspectRatio: false,
                legend: {
                  display: false,
                  position: "right",
                },
              }}
            />
          </div>
          <div
            className={`client-graph-container ${
              chart === "Steps" ? "" : "hidden"
            }`}
          >
            <Line
              data={STEPS_DATA}
              height="80"
              options={{
                responsive: true,
                scales: {
                  xAxes: [
                    {
                      type: "time",
                      time: {
                        unit: "day",
                        displayFormats: {
                          millisecond: "MMM D",
                          second: "MMM D",
                          minute: "MMM D",
                          hour: "MMM D",
                          day: "MMM D",
                          week: "MMM D",
                          month: "MMM D",
                          quarter: "MMM D",
                          year: "MMM D",
                        },
                      },
                    },
                  ],
                },
                maintainAspectRatio: false,
                legend: {
                  display: false,
                  position: "right",
                },
              }}
            />
          </div>
          <div
            className={`client-graph-container ${
              chart === "Survey" ? "" : "hidden"
            }`}
          >
            <Bar
              height="80"
              data={SURVEY_DATA}
              options={{
                responsive: true,
                scales: {
                  yAxes: [
                    {
                      stacked: false,
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      type: "time",
                      time: {
                        unit: "day",
                        displayFormats: {
                          millisecond: "MMM D",
                          second: "MMM D",
                          minute: "MMM D",
                          hour: "MMM D",
                          day: "MMM D",
                          week: "MMM D",
                          month: "MMM D",
                          quarter: "MMM D",
                          year: "MMM D",
                        },
                      },
                    },
                  ],
                },
                maintainAspectRatio: false,
                legend: {
                  display: false,
                  position: "right",
                },
              }}
            />
          </div>
        </div>
      </article>
      <div className="client-buttons">
        <Link
          className="client-button client-button-workout rounded shadow"
          to={`${data.client[0].id}/workout`}
        >
          <article className="client-workoutplan">
            <h1 className="client-workout-button">Workout plan</h1>
          </article>
        </Link>
        <Link
          className="client-button client-button-diet rounded shadow"
          to={`${data.client[0].id}/diet`}
        >
          <article className="client-diet-button">
            <h1 className="client-diet-button">Diet plan</h1>
          </article>
        </Link>
      </div>
      <article className="client-sidebar padding rounded shadow">
        <h1 className="hidden">Client information</h1>
        <div className="client-sidebar-top rounded">
          <img
            height="100"
            width="100"
            src={pic === null ? Dummy : pic}
            alt=""
          ></img>
          <div>
            <p className="client-name">
              {client.surname} {client.name}
            </p>
            <p className="client-dob">{client.dob}</p>
          </div>
        </div>
        <button>More button</button>
        <div className="client-sidebar-information">
          <div className="sidebar-container-address">
            <p className="smalltext address">Address</p>
            <p className="client-sidebar-input">{client.address}</p>
          </div>
          <div>
            <p className="smalltext postcode">Postal</p>
            <p className="client-sidebar-input">{client.postal}</p>
          </div>
          <div>
            <p className="smalltext city">City</p>
            <p className="client-sidebar-input">{client.city}</p>
          </div>
          <div>
            <p className="smalltext dob">Age</p>
            <p className="client-sidebar-input">20 Jaar</p>
          </div>
          <div>
            <p className="smalltext height">Height</p>
            <p className="client-sidebar-input">{client.height}cm</p>
          </div>
          <div>
            <p className="smalltext profession">Profession</p>
            <p className="client-sidebar-input">{client.profession}</p>
          </div>
          <div>
            <p className="smalltext bmi">BMI</p>
            <p className="client-sidebar-input">24.1</p>
          </div>
          <div className="contact">
            <p className="smalltext">Contact information</p>
            <div className="contact-item">
              <img width="21" height="16" src={Email} alt="" />
              <p className="client-sidebar-input">{client.email}</p>
            </div>
            <div className="contact-item">
              <img width="16" height="16" src={Phone} alt="" />
              <p className="client-sidebar-input">{client.phone}</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
