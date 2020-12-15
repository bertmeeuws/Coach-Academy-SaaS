import React, { useState } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState } from "easy-peasy";
import { gql, useQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import ArrowLeft from "../../assets/images/svg/ArrowLeft.svg";
import ArrowRight from "../../assets/images/svg/ArrowRight.svg";
import "../../styles/clientworkout.css";
import getDay from "date-fns/get_day";

const GET_WORKOUT = gql`
  query MyQuery($id: Int!) {
    client(where: { user_id: { _eq: $id } }) {
      workout_plans(order_by: { created_at: desc }, limit: 1) {
        workouts(order_by: { id: asc, order: asc }) {
          title
          day
          exercise_in_workouts(order_by: { order: asc }) {
            sets
            rpe
            reps
            notes
            exercise {
              name
            }
            order
          }
          id
          order
        }
        created_at
      }
    }
  }
`;

export default function ClientWorkout() {
  var day = getDay(new Date());
  const [count, setCount] = useState(day - 1);

  const id = useStoreState((state) => state.user_id);

  const [showNotes, setShowNotes] = useState(false);

  console.log(count);

  var weekday = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const { data } = useQuery(GET_WORKOUT, {
    variables: {
      id: id,
    },
  });

  if (!data) {
    return <LoaderLarge />;
  }
  console.log(data);

  const renderPlan = () => {
    if (data.client[0].workout_plans.length !== 0) {
      const { exercise_in_workouts } = data.client[0].workout_plans[0].workouts[
        count
      ];

      //const { name } = exercise;
      if (exercise_in_workouts.length !== 0) {
        return exercise_in_workouts.map((item) => {
          const { reps, sets, rpe, notes } = item;
          return (
            <>
              <p>{item.exercise.name}</p>
              <p>{sets}</p>
              <p>{reps}</p>
              <p>{rpe}</p>
              {notes !== "" ? (
                <p className="client-workout-notes">{item.notes}</p>
              ) : (
                ""
              )}
            </>
          );
        });
      } else {
        return <p className="client-workout-404">No workout found</p>;
      }
    }
  };

  //data.client[0].workout_plans[0].workouts

  return (
    <section className="client-workout-section">
      <MobileHeader />
      <div className="client-workout-container">
        <h1 className="client-dashboard-hero">Your workout plan</h1>
        <p className="client-dashboard-subtext">See your workout for today</p>
        <div className="mealplan-navigation">
          <div
            onClick={() => {
              if (count !== 0) {
                setCount(count - 1);
              }
            }}
            className="mealplan-navigation-hitbox "
          >
            <img src={ArrowLeft} alt="" />
          </div>
          <p>{weekday[count]}</p>
          <div
            onClick={() => {
              if (count !== 6) {
                setCount(count + 1);
                console.log(count);
              }
            }}
            className="mealplan-navigation-hitbox"
          >
            <img src={ArrowRight} alt="" />
          </div>
        </div>

        <div className="client-workout-table">
          <div className="client-workout-table-header">
            <p>Exercise</p>
            <p>Sets</p>
            <p>Reps</p>
            <p>RPE</p>
          </div>
          <div className="client-workout-table-grid">{renderPlan()}</div>
        </div>
      </div>
    </section>
  );
}
