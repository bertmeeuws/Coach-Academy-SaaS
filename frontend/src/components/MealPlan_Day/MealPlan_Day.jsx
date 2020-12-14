import React from "react";
import MEALPLAN_MEAL from "../MealPlan_Meal/MealPlan_Meal";

export default function MEALPLAN_DAY({
  data,
  setSelectedMealState,
  selectedMeal,
  deleteFood,
}) {
  const { meals } = data;

  return (
    <div>
      {Object.values(meals).map((meal, index) => {
        return (
          <MEALPLAN_MEAL
            setSelectedMealState={setSelectedMealState}
            index={index}
            selectedMeal={selectedMeal}
            meal={meal}
            deleteFood={deleteFood}
          />
        );
      })}
    </div>
  );
}
