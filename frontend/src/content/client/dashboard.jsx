import React, { useState } from "react";
import "../../styles/client.css";
import Questionnaire from "../../components/Questionnaire/Questionnaire";
import MobileHeader from "../../components/MobileHeader/MobileHeader";

export default function Dashboard() {
  const [craving, setCraving] = useState("");
  const [energyDay, setEnergyDay] = useState("");
  const [energyWorkout, setEnergyWorkout] = useState("");

  return (
    <>
      <MobileHeader />
      <section className="section client-dashboard">
        <h1 className="client-dashboard-hero">Welcome Bert!</h1>
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
        <article className="client-questionnaire rounded shadow">
          <h1 className="hidden">Questionnaire</h1>
          <div className="cravings">
            <h2 className="questionnaire-name">Cravings</h2>
            <div>
              <p className="questionnaire-ratings">none</p>
              <Questionnaire value={craving} set={setCraving} name="cravings" />
              <p className="questionnaire-ratings">a lot</p>
            </div>
          </div>
          <div className="energy">
            <h2 className="questionnaire-name">Energy during workout</h2>
            <div>
              <p className="questionnaire-ratings">low</p>
              <Questionnaire value={energyDay} set={setEnergyDay} name="day" />
              <p className="questionnaire-ratings">high</p>
            </div>
          </div>
          <div className="energyDay">
            <h2 className="questionnaire-name">Energy troughout the day</h2>
            <div>
              <p className="questionnaire-ratings">low</p>
              <Questionnaire
                value={energyWorkout}
                set={setEnergyWorkout}
                name="workout"
              />
              <p className="questionnaire-ratings">high</p>
            </div>
          </div>
        </article>
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
