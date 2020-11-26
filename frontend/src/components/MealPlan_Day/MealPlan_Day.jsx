import React from "react";
import MealPlan_Meal from "../MealPlan_Meal/MealPlan_Meal";

export default function MealPlan_Day({
  data,
  setSelectedMealState,
  selectedMeal,
}) {
  console.log(selectedMeal);
  const { name, meals } = data;

  return (
    <div>
      {Object.values(meals).map((meal, index) => {
        return (
          <MealPlan_Meal
            setSelectedMealState={setSelectedMealState}
            index={index}
            selectedMeal={selectedMeal}
            meal={meal}
          />
        );
      })}
    </div>
  );
}