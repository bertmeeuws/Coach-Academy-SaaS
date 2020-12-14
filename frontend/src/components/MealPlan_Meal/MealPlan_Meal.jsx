import React from "react";
import MEAL_ITEM from "../Meal_Item/Meal_Item";

export default function MEALPLAN_MEAL({
  index,
  meal,
  setSelectedMealState,
  selectedMeal,
  deleteFood,
}) {
  const mealNumber = index + 1;

  return (
    <>
      <p className="mealplan-title">Meal {mealNumber}</p>
      <div className="workout-table-header">
        <p></p>
        <p className="smalltext exercise">Food</p>
        <p className="smalltext sets">Carbs</p>
        <p className="smalltext reps">Proteins</p>
        <p className="smalltext reps">Fat</p>
        <p className="smalltext notes">Notes</p>
      </div>
      {meal.map((item) => {
        return (
          <MEAL_ITEM
            deleteFood={(unique) => deleteFood(unique, `meal${mealNumber}`)}
            item={item}
          />
        );
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
