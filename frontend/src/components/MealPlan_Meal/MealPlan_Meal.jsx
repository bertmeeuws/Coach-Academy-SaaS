import { selectionSetMatchesResult } from "@apollo/client/cache/inmemory/helpers";
import React from "react";
import Meal_Item from "../Meal_Item/Meal_Item";

export default function MealPlan_Meal({
  index,
  meal,
  setSelectedMealState,
  selectedMeal,
}) {
  const mealNumber = index + 1;
  console.log(selectedMeal);

  return (
    <>
      <p>Meal {mealNumber}</p>
      <div className="workout-table-header">
        <p></p>
        <p className="smalltext exercise">Food</p>
        <p className="smalltext sets">Carbs</p>
        <p className="smalltext reps">Proteins</p>
        <p className="smalltext reps">Fat</p>
        <p className="smalltext notes">Notes</p>
      </div>
      {meal.map((item) => {
        return <Meal_Item item={item} />;
      })}
      <div
        onClick={() => setSelectedMealState(`meal${mealNumber}`)}
        className={`workout-day-draganddrop ${
          selectedMeal === String("meal" + mealNumber)
            ? "  workout-plan-day--selected"
            : ""
        }`}
      >
        Click to add items here
      </div>
    </>
  );
}
