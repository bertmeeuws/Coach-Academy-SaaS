import React, { useState } from "react";

export default function ClientMealItem({
  amount,
  name,
  proteins,
  carbs,
  fats,
  notes,
}) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="mealplan-item-grid">
      <p>100g Rauw kipfielt</p>
      <p>1g</p>
      <p>22g</p>
      <p>0g</p>
      {showNotes ? (
        <p className="mealplan-item-notes">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus
          nec ligula non sagittis. Fusce efficitur magna ligula. Vestibulum
          porttitor.
        </p>
      ) : (
        ""
      )}
      <div>
        <button
          className={showNotes ? "mealplan-meal-button-inactive" : ""}
          onClick={(e) => setShowNotes(!showNotes)}
        >
          {showNotes && notes !== undefined ? "Close notes" : "View notes"}
        </button>
      </div>
      <div className="mealplan-meal-memo">
        <button>Start playing 22 sec</button>
      </div>
    </div>
  );
}
