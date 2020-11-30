import React, { useRef, useState } from "react";
import { TweenLite, Power3 } from "gsap";
import style from "./FoodSearchItem.module.css";

export default function FoodSearchItem({ data, clickFood, addFood }) {
  const { id, name, carbs, protein, fats } = data;

  const [open, setOpen] = useState(false);
  const [grams, setGrams] = useState(100);

  const [proteins, setProtein] = useState(protein);
  const [carb, setCarb] = useState(carbs);
  const [fat, setFat] = useState(fats);

  if (open) {
    TweenLite.to(".foodsearchitem-popup", 0.3, {
      height: "100%",
      ease: Power3.easeInOut,
    });
  } else {
    TweenLite.to(".foodsearchitem-popup", 0.3, {
      height: "0%",
      ease: Power3.easeInOut,
    });
  }
  const setValues = () => {
    const calculatedProtein = (Number(protein) / 10) * grams;
    setProtein(calculatedProtein);
    const calculatedCarbs = (Number(carbs) / 10) * grams;
    setCarb(calculatedCarbs);
    const calculatedFats = (Number(fats) / 10) * grams;
    setFat(calculatedFats);
  };

  return (
    <div
      className={style.item}
      onClick={() => (open ? setOpen(false) : setOpen(true))}
    >
      <p className={style.name}>{name}</p>
      <p className={style.carbs}>Carbs: {carb}g</p>
      <p className={style.proteins}>Proteins: {proteins}g</p>
      <p className={style.fats}>Fats: {fat}g</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addFood({
            id: id,
            name: name,
            protein: proteins,
            carbs: carb,
            fats: fat,
            grams: grams,
          });
        }}
        className="foodsearchitem-popup shadow"
      >
        <input
          placeholder="How much grams"
          value={grams}
          onChange={(e) => {
            setGrams(e.currentTarget.value);
            setValues();
          }}
          type="text"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
