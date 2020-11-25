import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Breadcrumb from "../../assets/images/breadcrumbs.png";

export default function Diet() {
  const { id } = useParams();

  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState([]);

  const searchFoods = () => {};

  return (
    <section className="client-diet">
      <div className="client-workout-breadcrumbs">
        <Link className="client-workout-breadcrumbs--link" to="/clients">
          All clients
        </Link>
        <img className="client-workout-breadcrumbs-icon" src={Breadcrumb}></img>
        <Link className="client-workout-breadcrumbs--link" to={"/client/" + id}>
          Maxime Vercruysse
        </Link>{" "}
        <img className="client-workout-breadcrumbs-icon" src={Breadcrumb}></img>
        <Link className="client-workout-breadcrumbs--link">Add diet plan</Link>
      </div>
      <div className="client-diet-grid">
        <article className="diet-plan rounded shadow">
          <form>
            <p>Meal 1 - </p>
            <div className="workout-table-header">
              <p></p>
              <p className="smalltext exercise">Food</p>
              <p className="smalltext sets">Carbs</p>
              <p className="smalltext reps">Proteins</p>
              <p className="smalltext reps">Fat</p>
              <p className="smalltext notes">Notes</p>
            </div>
            <>
              <div className="workout-plan-day">
                <div className="workout-plan-exercise workout-plan-exercise-table">
                  <p className="workout-plan-delete">X</p>
                  <div className="workout-exercise">
                    <div className="workout-instructionVideo"></div>
                    <p className="workout-exercise-name">Kipfilet</p>
                  </div>
                  <input placeholder="." required type="text" value="1g" />
                  <input placeholder="." required type="text" value="1g" />
                  <input placeholder="." required type="text" value="1g" />
                  <input placeholder="." required type="text" value="1g" />
                  <p className="workout-exercise-notes smalltext">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    cursus nec ligula non sagittis. Fusce efficitur magna
                    ligula. Vestibulum porttitor, magna eu scelerisque
                    malesuada, nibh augue egestas justo, et aliquam dui mi at
                    justo. Vestibulum at est posuere, venenatis neque a, commodo
                    nulla.
                  </p>
                </div>
              </div>

              <div className={`workout-day-draganddrop`}>
                Click to add items here
              </div>
            </>
          </form>
        </article>
        <article className="diet-foods rounded shadow">
          <form>
            <input
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                searchFoods();
              }}
              name="searchFood"
              placeholder="Search"
              value={search}
              type="text"
            />
          </form>
        </article>
      </div>
    </section>
  );
}
