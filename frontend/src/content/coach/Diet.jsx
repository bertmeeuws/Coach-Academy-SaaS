import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Breadcrumb from "../../assets/images/breadcrumbs.png";
import { v4 as uuidv4 } from "uuid";
import { useLocalStore, action } from "easy-peasy";
import { useQuery, gql, useMutation } from "@apollo/client";
import MealPlan_Meal from "../../components/MealPlan_Meal/MealPlan_Meal";
import MealPlan_Day from "../../components/MealPlan_Day/MealPlan_Day";

export default function Diet() {
  const { id } = useParams();

  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState([]);

  const arrDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [state, actions] = useLocalStore(() => ({
    selectedDay: "Monday",
    selectedMeal: "meal1",
    setSelectedMeal: action((_state, payload) => {
      _state.selectedMeal = payload;
      console.log(_state.selectedMeal);
    }),
    Days: {
      Monday: {
        day: "Monday",
        meals: {
          meal1: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
          meal2: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
          meal3: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
          meal4: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
          meal5: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
          meal6: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
          meal7: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
          meal8: [{ name: "Egg", proteins: "5", carbs: "4", fats: "6" }],
        },
      },
      Tuesday: {
        day: "Tuesday",
        meals: {
          meal1: [],
          meal2: [],
          meal3: [],
          meal4: [],
          meal5: [],
          meal6: [],
          meal7: [],
          meal8: [],
        },
      },
      Wednesday: {
        day: "Wednesday",
        meals: {
          meal1: [],
          meal2: [],
          meal3: [],
          meal4: [],
          meal5: [],
          meal6: [],
          meal7: [],
          meal8: [],
        },
      },
      Thursday: {
        day: "Thursday",
        meals: {
          meal1: [],
          meal2: [],
          meal3: [],
          meal4: [],
          meal5: [],
          meal6: [],
          meal7: [],
          meal8: [],
        },
      },
      Friday: {
        day: "Friday",
        meals: {
          meal1: [],
          meal2: [],
          meal3: [],
          meal4: [],
          meal5: [],
          meal6: [],
          meal7: [],
          meal8: [],
        },
      },
      Saturday: {
        day: "Saturday",
        meals: {
          meal1: [],
          meal2: [],
          meal3: [],
          meal4: [],
          meal5: [],
          meal6: [],
          meal7: [],
          meal8: [],
        },
      },
      Sunday: {
        day: "Sunday",
        meals: {
          meal1: [],
          meal2: [],
          meal3: [],
          meal4: [],
          meal5: [],
          meal6: [],
          meal7: [],
          meal8: [],
        },
      },
    },
  }));

  const searchFoods = () => {};

  return (
    <section className="client-diet">
      <div className="client-workout-breadcrumbs">
        <Link className="client-workout-breadcrumbs--link" to="/clients">
          All clients
        </Link>
        <img className="client-workout-breadcrumbs-icon" src={Breadcrumb}></img>
        <Link className="client-workout-breadcrumbs--link" to={"/client/" + id}>
          Maxime Vercruysse
        </Link>{" "}
        <img className="client-workout-breadcrumbs-icon" src={Breadcrumb}></img>
        <Link className="client-workout-breadcrumbs--link">Add diet plan</Link>
      </div>
      <div className="client_diet-days">
        {arrDays.map((day, index) => {
          return <span key={index}>{day}</span>;
        })}
      </div>
      <div className="client-diet-grid">
        <article className="diet-plan rounded shadow">
          <form>
            <MealPlan_Day
              selectedMeal={state.selectedMeal}
              setSelectedMealState={(value) => {
                actions.setSelectedMeal(String(value));
              }}
              data={state.Days[state.selectedDay]}
            />
          </form>
        </article>
        <article className="diet-foods rounded shadow">
          <form>
            <input
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                searchFoods();
              }}
              name="searchFood"
              placeholder="Search"
              value={search}
              type="text"
            />
          </form>
        </article>
      </div>
    </section>
  );
}
