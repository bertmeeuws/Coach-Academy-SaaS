import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import ClientMealItem from "../../components/ClientMealItem/ClientMealItem";
import ClientMealHeader from "../../components/ClientMealHeader/ClientMealHeader";
import { useStoreState, useLocalStore } from "easy-peasy";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import "../../styles/edit.css";
import ArrowLeft from "../../assets/images/svg/ArrowLeft.svg";
import ArrowRight from "../../assets/images/svg/ArrowRight.svg";
import "../../styles/diet.css";

const GET_MEALPLAN = gql`
  query MyQuery($id: Int!) @cached(ttl: 120) {
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

  const [count, setCount] = useState(1);

  let navIndex;

  const { data: mealPlanData, loading, errors } = useQuery(GET_MEALPLAN, {
    variables: {
      id: id,
    },
  });

  const today = new Date().toLocaleString("en-us", { weekday: "long" });

  useEffect(async () => {
    if (mealPlanData && mealPlanData.diet_plan[0] !== undefined) {
      let i = mealPlanData.diet_plan[0].diet_dayPlans.findIndex(
        (x) => x.name === today
      );

      navIndex = i;
      setCount(i);
    }
  }, [mealPlanData]);

  if (!mealPlanData && loading) {
    return (
      <>
        <MobileHeader />
        <LoaderLarge />
      </>
    );
  }

  const renderNavigation = () => {
    if (mealPlanData !== undefined) {
      if (count === navIndex - 1) {
        return <p>Yesterday</p>;
      } else if (count === navIndex + 1) {
        return <p>Tomorrow</p>;
      } else if (count === navIndex) {
        return <p>Today</p>;
      } else {
        if (mealPlanData.diet_plan[0] !== undefined) {
          return <p>{mealPlanData.diet_plan[0].diet_dayPlans[count].name}</p>;
        }
      }
    }
  };

  const renderMeals = () => {
    //console.log(mealPlanData.diet_plan[0].diet_dayPlans[count]);

    if (mealPlanData !== undefined) {
      console.log(mealPlanData);
      if (mealPlanData.diet_plan.length !== 0) {
        console.log(count);
        console.log(mealPlanData.diet_plan[0].diet_dayPlans[count]);
        return mealPlanData.diet_plan[0].diet_dayPlans[count].diet_meals.map(
          (item, index) => {
            return (
              <>
                <h2 className="mealplan-name">Meal {index + 1}</h2>

                {item.diet_mealItems.length === 0 ? (
                  <p className="client-diet-nomeals">No meals found</p>
                ) : (
                  <ClientMealHeader key={index} />
                )}

                {item.diet_mealItems.map((mealItem) => {
                  return (
                    <ClientMealItem
                      key={mealItem.order}
                      amount={mealItem.amount === null ? 100 : mealItem.amount}
                      name={mealItem.name}
                      proteins={mealItem.proteins}
                      fats={mealItem.fats}
                      carbs={mealItem.carbs}
                    />
                  );
                })}
              </>
            );
          }
        );
      }
    }
  };

  return (
    <div>
      <MobileHeader />
      <section className="section client-mealplan">
        <h1 className="client-edit-hero">Mealplan</h1>
        <p className="client-edit-subtext">View your mealplan for the week.</p>
        <article className="mealplan">
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
            <p>{renderNavigation()}</p>
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
          <section className="mealplan-meal">{renderMeals()}</section>
        </article>
      </section>
    </div>
  );
}
