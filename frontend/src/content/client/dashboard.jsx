import React, { useState, useEffect } from "react";
import "../../styles/client.css";
import Questionnaire from "../../components/Questionnaire/Questionnaire";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState } from "easy-peasy";
import { useQuery, gql, useMutation, useLazyQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import CoachPopup from "../../components/AddCoach/Index";
import { Link } from "react-router-dom";
import getDay from "date-fns/get_day";

const GET_USER_DATA = gql`
  query MyQuery($id: Int!, $date: date!) {
    client(where: { user_id: { _eq: $id } }, limit: 1) {
      name
      weight
      coach_id
      surname
      user {
        surveys(limit: 1, where: { created_at: { _eq: $date } }) {
          id
          energy_workout
          energy_day
          craving
        }
      }
    }
    workout_plan(
      where: { client: { user_id: { _eq: $id } } }
      limit: 1
      order_by: { created_at: desc }
    ) {
      id
      workouts(order_by: { order: asc }) {
        day
        title
        exercise_in_workouts {
          sets
          reps
          exercise {
            name
          }
        }
      }
    }
    diet_plan(
      where: { client: { user_id: { _eq: $id } } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      diet_dayPlans {
        name
        diet_meals {
          id
          diet_mealItems {
            name
            proteins
            fats
            carbs
            amount
          }
        }
      }
    }
    weight(
      where: { user_id: { _eq: $id }, _and: { date: { _eq: $date } } }
      limit: 1
      order_by: { created_at: desc }
    ) {
      weight
      user_id
      date
    }
  }
`;

const INSERT_EMPTY_SURVEY = gql`
  mutation InsertEmptySurvey($object: survey_insert_input!) {
    insert_survey_one(object: $object) {
      user_id
      energy_day
      energy_workout
      craving
    }
  }
`;

const UPDATE_SURVEY = gql`
  mutation UpdateSurvey(
    $user_id: Int_comparison_exp!
    $date: date!
    $energy_day: Int!
    $energy_workout: Int!
    $craving: Int!
  ) {
    update_survey(
      where: { _and: { created_at: { _eq: $date } }, user_id: $user_id }
      _set: {
        energy_day: $energy_day
        energy_workout: $energy_workout
        craving: $craving
      }
    ) {
      returning {
        energy_day
        energy_workout
        craving
      }
    }
  }
`;

const CHECK_IF_USER_HAS_SURVEY = gql`
  query CheckIfUserHasSurvey($user_id: Int!, $date: date!) {
    survey(
      where: {
        user_id: { _eq: $user_id }
        _and: { created_at: { _eq: $date } }
      }
    ) {
      id
      energy_day
      energy_workout
      craving
    }
  }
`;

const ADD_WEIGHT = gql`
  mutation MyMutation($object: weight_insert_input!) {
    insert_weight_one(object: $object) {
      id
    }
  }
`;

export default function Dashboard() {
  var day = getDay(new Date());

  const [craving, setCraving] = useState(3);
  const [energyDay, setEnergyDay] = useState(3);
  const [energyWorkout, setEnergyWorkout] = useState(3);
  const [inviter, setInviter] = useState(false);
  const [weight, setWeight] = useState("");
  const [injectedEmptyForm, setInjectedEmptyForm] = useState(false);

  const id = useStoreState((state) => state.user_id);

  const [INSERT_EMPTY_SURVEY_FOR_USER] = useMutation(INSERT_EMPTY_SURVEY);
  const [UPDATE_SURVEY_USER] = useMutation(UPDATE_SURVEY);
  const [ADD_WEIGHT_DB] = useMutation(ADD_WEIGHT);

  const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return (today = yyyy + "-" + mm + "-" + dd);
  };

  const today = new Date().toLocaleString("en-us", { weekday: "long" });

  let indexOfTodayDiet;

  const [fetchForSurveys, { data: hasSurvey }] = useLazyQuery(
    CHECK_IF_USER_HAS_SURVEY,
    {
      variables: {
        user_id: id,
        date: getDate(),
      },
    }
  );

  //const { data: survey } = useQuery(CHECK_IF_USER_HAS_SURVEY);

  const { data, errors, loading } = useQuery(GET_USER_DATA, {
    variables: {
      id: id,
      date: getDate(),
    },
  });

  useEffect(async () => {
    if (hasSurvey) {
      console.log(hasSurvey);
      if (hasSurvey.survey.length === 1) {
        console.log(hasSurvey.survey.lenght);
        setEnergyWorkout(hasSurvey.survey[0].energy_workout);
        setEnergyDay(hasSurvey.survey[0].energy_day);
        setCraving(hasSurvey.survey[0].craving);
      }
    } else {
      await fetchForSurveys();
    }
  }, [hasSurvey]);

  let hasTodayRendered = false;

  if (!data) {
    return <LoaderLarge />;
  }
  console.log(data);

  const addAnswersToDatabase = async (e) => {
    e.preventDefault();
    //if there is no survey in the database for today, create one first.

    if (hasSurvey.survey.length === 0 && injectedEmptyForm === false) {
      console.log("No survey yet");
      const { data: created_item } = await INSERT_EMPTY_SURVEY_FOR_USER({
        variables: {
          object: {
            user_id: id,
            energy_day: Number(energyDay),
            energy_workout: Number(energyWorkout),
            craving: Number(craving),
          },
        },
      });
      await fetchForSurveys();
      setInjectedEmptyForm(true);

      console.log(created_item);
    } else {
      //update survey from user
      console.log("Updating survey");
      console.log(craving + " " + energyWorkout + " " + energyDay);
      const { data, errors } = await UPDATE_SURVEY_USER({
        variables: {
          user_id: { _eq: id },
          date: getDate(),
          energy_day: Number(energyDay),
          energy_workout: Number(energyWorkout),
          craving: Number(craving),
        },
      });
      console.log(data);
    }

    //if there is one for today, update with the values
  };

  const handleFormWeight = async () => {
    if (weight !== "") {
      const { data, error } = await ADD_WEIGHT_DB({
        variables: {
          object: {
            weight: weight,
            date: new Date(),
            user_id: id,
          },
        },
      });
      console.log(data);
    } else {
      alert("Something is wrong with your weight");
    }
  };

  const renderDiet = () => {
    return data.diet_plan[0].diet_dayPlans.map((item, index) => {
      if (item.name === "Monday") {
        indexOfTodayDiet = index;
        //console.log(item);
        console.log(item);
        let calories = 0;
        let proteins = 0;
        let carbs = 0;
        let fats = 0;
        item.diet_meals.map((meal) => {
          meal.diet_mealItems.map((item) => {
            let amount = item.amount === null ? 100 : item.amount;
            //values are per 100 grams. Multiple to desired value
            let multiplier = amount / 100;
            console.log(amount);
            proteins += item.proteins;
            carbs += item.carbs;
            fats += item.fats;
            calories +=
              item.carbs * 4 * multiplier +
              item.proteins * 4 * multiplier +
              item.fats * 9 * multiplier;
          });
        });
        console.log(carbs);
        hasTodayRendered = true;
        return (
          <div className="mealplan-box shadow rounded">
            <p className="mealplan-calories">
              {Math.round(calories, 0)} calories
            </p>
            <p className="mealplan-macros blue">{Math.round(proteins, 0)}g</p>
            <p className="mealplan-macros">proteins</p>
            <p className="mealplan-macros blue">{Math.round(carbs, 0)}g</p>
            <p className="mealplan-macros">carbs</p>
            <p className="mealplan-macros blue">{Math.round(fats, 0)}g</p>
            <p className="mealplan-macros">fats</p>
            <p className="mealplan-day">Today</p>
          </div>
        );
      } else if (hasTodayRendered) {
        console.log(item);
        let calories = 0;
        let proteins = 0;
        let carbs = 0;
        let fats = 0;
        item.diet_meals.map((meal) => {
          meal.diet_mealItems.map((item) => {
            let amount = item.amount === null ? 100 : item.amount;
            //values are per 100 grams. Multiple to desired value
            let multiplier = amount / 100;
            console.log(amount);
            proteins += item.proteins;
            carbs += item.carbs;
            fats += item.fats;
            calories +=
              item.carbs * 4 * multiplier +
              item.proteins * 4 * multiplier +
              item.fats * 9 * multiplier;
          });
        });
        console.log(carbs);
        hasTodayRendered = true;
        return (
          <div className="mealplan-box mealplan-box-inactive shadow rounded">
            <p className="mealplan-calories">
              {Math.round(calories, 0)} calories
            </p>
            <p className="mealplan-macros blue">{Math.round(proteins, 0)}g</p>
            <p className="mealplan-macros">proteins</p>
            <p className="mealplan-macros blue">{Math.round(carbs, 0)}g</p>
            <p className="mealplan-macros">carbs</p>
            <p className="mealplan-macros blue">{Math.round(fats, 0)}g</p>
            <p className="mealplan-macros">fats</p>
            <p className="mealplan-day">
              {index + 1 === indexOfTodayDiet ? "Tomorrow" : item.name}
            </p>
          </div>
        );
      }
    });
  };

  const renderWorkout = () => {
    const { title, exercise_in_workouts } = data.workout_plan[0].workouts[
      day - 1
    ];
    if (data.workout_plan[0].workouts[day - 1].length !== 0) {
      if (exercise_in_workouts.length !== 0) {
        return (
          <>
            <thead>
              <tr>
                <th className="workout-name">{title}</th>
                <th className="smalltext">SETS</th>
                <th className="smalltext">REPS</th>
              </tr>
            </thead>
            <tbody>
              {exercise_in_workouts.map((exercise) => {
                return (
                  <tr>
                    <td>{exercise.exercise.name}</td>
                    <td>{exercise.sets}</td>
                    <td>{exercise.reps}</td>
                  </tr>
                );
              })}
            </tbody>
          </>
        );
      } else {
        return <p>You have no exercises planned today.</p>;
      }
    }
  };

  return (
    <>
      <MobileHeader />
      <section className="section client-dashboard">
        {data.client[0].coach_id === null ? (
          <p onClick={(e) => setInviter(!inviter)} className="disclaimer-coach">
            You don't have coach yet.
          </p>
        ) : (
          ""
        )}
        {inviter ? <CoachPopup /> : ""}
        <h1 className="client-dashboard-hero">
          Welcome {data.client[0].surname}!
        </h1>
        <p className="client-dashboard-subtext">
          Let's start achieving your goals.
        </p>
        <article className="client-weight rounded shadow">
          <h1 className="hidden">Weight</h1>
          {data.weight.length !== 0 ? (
            <p className="client-weight-title">
              You already weighed yourself with Google Fit.
            </p>
          ) : (
            <p className="client-weight-title">
              How much did you weigh this morning?
            </p>
          )}
          <input
            className="client-weight-input"
            value={weight}
            type="number"
            placeholder="kg"
            step=".01"
            onChange={(e) => setWeight(e.currentTarget.value)}
          />
          <button onClick={handleFormWeight} className="client-weight-button">
            Confirm
          </button>
        </article>
        <form
          onSubmit={addAnswersToDatabase}
          className="client-questionnaire rounded shadow"
        >
          <h1 className="hidden">Questionnaire</h1>
          <div className="cravings">
            <h2 className="questionnaire-name">Cravings</h2>
            <div>
              <p className="questionnaire-ratings">none</p>
              <Questionnaire
                value={craving}
                set={(value) => {
                  setCraving(value);
                }}
                name="cravings"
              />
              <p className="questionnaire-ratings">a lot</p>
            </div>
          </div>
          <div className="energy">
            <h2 className="questionnaire-name">Energy during workout</h2>
            <div>
              <p className="questionnaire-ratings">low</p>
              <Questionnaire
                value={energyWorkout}
                set={(value) => {
                  setEnergyWorkout(value);
                }}
                name="day"
              />
              <p className="questionnaire-ratings">high</p>
            </div>
          </div>
          <div className="energyDay">
            <h2 className="questionnaire-name">Energy troughout the day</h2>
            <div>
              <p className="questionnaire-ratings">low</p>
              <Questionnaire
                value={energyDay}
                set={(value) => {
                  setEnergyDay(value);
                }}
                name="workout"
              />
              <p className="questionnaire-ratings">high</p>
            </div>
          </div>
          <input
            type="submit"
            className="button button-submit-questions shadow"
            value="Submit form"
          />
        </form>
        <article className="client-workout">
          <h1 className="client-workout-title">Today's workout</h1>
          <Link to="/clientworkout" className="dashboard-workout-link">
            <table className="dashboard-workout shadow rounded">
              {data.workout_plan.length !== 0 ? (
                renderWorkout()
              ) : (
                <p>You have no exercises planned today.</p>
              )}
            </table>
          </Link>
        </article>
        <article className="client-mealplan">
          <h1 className="client-mealplan-title">Your meal plan</h1>
          <div className="client-mealplan-carousel">
            {data.diet_plan.length !== 0 ? (
              renderDiet()
            ) : (
              <div className="dashboard-diet-404 shadow rounded">
                <p>No diet plan has been assigned to you</p>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
