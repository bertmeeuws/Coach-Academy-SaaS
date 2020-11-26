import React from "react";

export default function Meal_Item({ item }) {
  const { name, proteins, fats, carbs } = item;

  return (
    <div className="workout-plan-day">
      <div className="workout-plan-exercise workout-plan-exercise-table">
        <p className="workout-plan-delete">X</p>
        <div className="workout-exercise">
          <div className="workout-instructionVideo"></div>
          <p className="workout-exercise-name">{name}</p>
        </div>
        <input placeholder="." required type="text" value={carbs} />
        <input placeholder="." required type="text" value={proteins} />
        <input placeholder="." required type="text" value={fats} />
        <input placeholder="." required type="text" value="notes" />
        <p className="workout-exercise-notes smalltext">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus
          nec ligula non sagittis. Fusce efficitur magna ligula. Vestibulum
          porttitor, magna eu scelerisque malesuada, nibh augue egestas justo,
          et aliquam dui mi at justo. Vestibulum at est posuere, venenatis neque
          a, commodo nulla.
        </p>
      </div>
    </div>
  );
}
