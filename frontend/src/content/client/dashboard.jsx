import React, { useState, useEffect } from "react";
import "../../styles/client.css";
import Questionnaire from "../../components/Questionnaire/Questionnaire";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState } from "easy-peasy";
import { useQuery, gql, useMutation, useLazyQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import CoachPopup from "../../components/AddCoach/Index";

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

export default function Dashboard() {
  const [craving, setCraving] = useState("");
  const [energyDay, setEnergyDay] = useState("");
  const [energyWorkout, setEnergyWorkout] = useState("");
  const [inviter, setInviter] = useState(false);

  const id = useStoreState((state) => state.user_id);

  const [INSERT_EMPTY_SURVEY_FOR_USER] = useMutation(INSERT_EMPTY_SURVEY);
  const [UPDATE_SURVEY_USER] = useMutation(UPDATE_SURVEY);

  const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return (today = yyyy + "-" + mm + "-" + dd);
  };

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
      setEnergyWorkout(hasSurvey.survey[0].energy_workout);
      setEnergyDay(hasSurvey.survey[0].energy_day);
      setCraving(hasSurvey.survey[0].craving);
    } else {
      await fetchForSurveys();
    }
  }, [hasSurvey]);

  if (!data) {
    return <LoaderLarge />;
  }

  const addAnswersToDatabase = async (e) => {
    e.preventDefault();
    //if there is no survey in the database for today, create one first.

    if (hasSurvey.survey.length === 0) {
      console.log("No survey yet");
      const { data: created_item } = await INSERT_EMPTY_SURVEY_FOR_USER({
        variables: {
          object: {
            user_id: id,
            energy_day: 3,
            energy_workout: 3,
            craving: 3,
          },
        },
      });
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
          <p className="client-weight-title">
            How much did you weigh this morning?
          </p>
          <input className="client-weight-input" type="text" />
          <button className="client-weight-button">Confirm</button>
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
          <input type="submit" value="submit" />
        </form>
        <article className="client-workout">
          <h1 className="client-workout-title">Today's workout</h1>
          <table className="dashboard-workout shadow rounded">
            <tr>
              <th className="workout-name">Pull day</th>
              <th className="smalltext">SETS</th>
              <th className="smalltext">REPS</th>
            </tr>
            <tr>
              <td>Barbell rows</td>
              <td>3</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Barbell rows</td>
              <td>3</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Barbell rows</td>
              <td>3</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Barbell rows</td>
              <td>3</td>
              <td>5</td>
            </tr>
          </table>
        </article>
        <article className="client-mealplan">
          <h1 className="client-mealplan-title">Your meal plan</h1>
          <div className="client-mealplan-carousel">
            <div className="mealplan-box shadow rounded">
              <p className="mealplan-calories">2630 calories</p>
              <p className="mealplan-macros blue">200g</p>
              <p className="mealplan-macros">proteins</p>
              <p className="mealplan-macros blue">300g</p>
              <p className="mealplan-macros">carbs</p>
              <p className="mealplan-macros blue">70g</p>
              <p className="mealplan-macros">fats</p>
              <p className="mealplan-day">Today</p>
            </div>
            <div className="mealplan-box mealplan-box-inactive shadow rounded">
              <p className="mealplan-calories">2630 calories</p>
              <p className="mealplan-macros blue">200g</p>
              <p className="mealplan-macros">proteins</p>
              <p className="mealplan-macros blue">300g</p>
              <p className="mealplan-macros">carbs</p>
              <p className="mealplan-macros blue">70g</p>
              <p className="mealplan-macros">fats</p>
              <p className="mealplan-day">Tomorrow</p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
