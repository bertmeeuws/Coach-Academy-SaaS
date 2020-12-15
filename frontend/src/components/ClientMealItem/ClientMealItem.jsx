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
      <p>
        {amount}g {name}
      </p>
      <p>{carbs}g</p>
      <p>{proteins}g</p>
      <p>{fats}g</p>
    </div>
  );
}
