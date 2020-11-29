import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Breadcrumb from "../../assets/images/breadcrumbs.png";
import { v4 as uuidv4 } from "uuid";
import { useLocalStore, action } from "easy-peasy";
import { useQuery, gql, useMutation } from "@apollo/client";
import MealPlan_Day from "../../components/MealPlan_Day/MealPlan_Day";
import FoodSearchItem from "../../components/FoodSearchItem/FoodSearchItem";
import FatSecret from "../../FatSecret.js";

export default function Diet() {
  const { id } = useParams();

  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState([]);

  const createMealItem = (name, proteins, carbs, fats) => {
    return {
      name: name,
      proteins: proteins,
      carbs: carbs,
      fats: fats,
      unique_id: uuidv4(),
    };
  };

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
    }),
    setSelectedDay: action((_state, payload) => {
      _state.selectedDay = payload;
    }),
    addFood: action((_state, payload) => {
      _state.Days[_state.selectedDay].meals[_state.selectedMeal].push({
        id: payload.id,
        name: payload.name,
        proteins: payload.protein,
        carbs: payload.carbs,
        fats: payload.fats,
        grams: payload.grams,
        unique: uuidv4(),
      });
    }),
    Days: {
      Monday: {
        day: "Monday",
        meals: {
          meal1: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal2: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal3: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal4: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal5: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal6: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal7: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal8: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
        },
      },
      Tuesday: {
        day: "Tuesday",
        meals: {
          meal1: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
          meal2: [],
          meal3: [],
          meal4: [],
          meal5: [],
          meal6: [],
          meal7: [],
          meal8: [
            {
              name: "Egg",
              proteins: "5",
              carbs: "4",
              fats: "6",
              unique_id: uuidv4(),
            },
          ],
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

  const fatSecret = new FatSecret();

  async function getRecipe(name) {
    const { recipes } = await fatSecret.request({
      method: "recipes.search",
      search_expression: name,
      max_results: 1,
    });
    return recipes;
  }

  async function getFood(name) {
    const { foods } = await fatSecret.request({
      method: "foods.search",
      search_expression: name,
      max_results: 10,
    });
    return foods.food;
  }

  const searchFoods = async (e) => {
    e.preventDefault();
    //Search in API
    const food = await getFood("Chicken");

    let arrParsedFoods = [];

    food.forEach((element) => {
      let array = element.food_description.split(" ");
      let id = element.food_id;
      let name = element.food_name;
      let proteins;
      let fats;
      let carbs;
      array.forEach((item, index) => {
        if (item.includes("Protein:")) {
          proteins = array[index + 1].slice(0, -1);
        }
        if (item.includes("Fat:")) {
          fats = array[index + 1].slice(0, -1);
        }
        if (item.includes("Carbs:")) {
          carbs = array[index + 1].slice(0, -1);
        }
      });

      arrParsedFoods.push({
        id: id,
        amount: "100 grams",
        name: name,
        protein: proteins,
        fats: fats,
        carbs: carbs,
      });
    });
    setFoods(arrParsedFoods);
    console.log(foods);
  };

  const onClickFood = () => {};

  const addFood = (data) => {
    actions.addFood(data);
    console.log(state.Days);
  };

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
          return (
            <span
              style={
                state.selectedDay === day
                  ? { backgroundColor: "var(--green)", color: "var(--white)" }
                  : {}
              }
              onClick={(e) => actions.setSelectedDay(String(day))}
              key={index}
            >
              {day}
            </span>
          );
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
          <form
            className="diet-foods-search-form"
            onSubmit={(e) => searchFoods(e)}
          >
            <input
              onChange={(e) => {
                setSearch(e.currentTarget.value);
              }}
              name="searchFood"
              placeholder="Search"
              value={search}
              type="text"
            />
            <button className="diet-search-button">Search</button>
          </form>
          {foods
            ? foods.map((item) => {
                return (
                  <FoodSearchItem
                    addFood={addFood}
                    clickFood={onClickFood}
                    data={item}
                  />
                );
              })
            : ""}
        </article>
      </div>
    </section>
  );
}
