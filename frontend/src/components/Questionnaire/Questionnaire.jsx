import React, { useState } from "react";

export default function Questionnaire({ name, value, set }) {
  return (
    <form className="questionnaire-component">
      <input
        type="radio"
        id="1"
        name={name}
        checked={value === 1}
        onClick={() => set(1)}
        value="1"
      ></input>
      <input
        type="radio"
        id="2"
        name={name}
        checked={value === 2}
        onClick={() => set(2)}
        value="2"
      ></input>
      <input
        type="radio"
        id="3"
        name={name}
        checked={value === 3}
        onClick={() => set(3)}
        value="3"
      ></input>
      <input
        type="radio"
        id="4"
        name={name}
        checked={value === 4}
        onClick={() => set(4)}
        value="4"
      ></input>
      <input
        type="radio"
        id="5"
        name={name}
        checked={value === 5}
        onClick={() => set(5)}
        value="5"
      ></input>
    </form>
  );
}
