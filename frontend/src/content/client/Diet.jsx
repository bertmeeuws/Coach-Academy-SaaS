import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import ClientMealItem from "../../components/ClientMealItem/ClientMealItem";
import ClientMealHeader from "../../components/ClientMealHeader/ClientMealHeader";
import { useStoreState, useLocalStore } from "easy-peasy";
import { gql, useLazyQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import "../../styles/edit.css";
import ArrowLeft from "../../assets/images/svg/ArrowLeft.svg";
import ArrowRight from "../../assets/images/svg/ArrowRight.svg";
import "../../styles/diet.css";

const GET_MEALPLAN = gql`
  query MyQuery($id: Int!) {
    diet_plan(
      where: { client: { user: { id: { _eq: $id } } } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      diet_dayPlans(order_by: { id: asc }) {
        name
        diet_meals(order_by: { order: asc }) {
          id
          diet_mealItems {
            amount
            carbs
            fats
            name
            proteins
          }
          order
        }
      }
    }
  }
`;

export default function ClientDiet() {
  const id = useStoreState((state) => state.user_id);

  const [mealPlan, setMealPlan] = useState([]);
  const [nav, setNav] = useState(null);

  const [FETCH_MEALPLAN, { data: mealPlanData }] = useLazyQuery(GET_MEALPLAN, {
    variables: {
      id: 73,
    },
  });

  const today = new Date().toLocaleString("en-us", { weekday: "long" });

  useEffect(() => {
    if (mealPlanData) {
      setMealPlan(mealPlanData.diet_plan[0].diet_dayPlans);
      console.log(mealPlan);
      let index = mealPlan.findIndex((x) => x.name === today);
      setNav(index);
    } else {
      FETCH_MEALPLAN();
    }
  }, mealPlanData);

  console.log(nav);

  return (
    <div>
      <MobileHeader />
      <section className="section client-mealplan">
        <h1 className="client-edit-hero">Mealplan</h1>
        <p className="client-edit-subtext">View your mealplan for the week.</p>
        <article className="mealplan">
          <div className="mealplan-navigation">
            <div
              onClick={(e) => {
                if (nav !== 0) {
                  setNav(nav++);
                }
              }}
              className="mealplan-navigation-hitbox "
            >
              <img src={ArrowLeft} alt="" />
            </div>
            <p>Today</p>
            <div
              onClick={(e) => {
                if (nav !== 6) {
                  setNav(nav++);
                }
              }}
              className="mealplan-navigation-hitbox"
            >
              <img src={ArrowRight} alt="" />
            </div>
          </div>
          <section className="mealplan-meal">
            <h2 className="mealplan-name">Meal 1</h2>
            <ClientMealHeader />
            <ClientMealItem />
          </section>
        </article>
      </section>
    </div>
  );
}
