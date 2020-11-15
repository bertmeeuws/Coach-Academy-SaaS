import React, { useState } from "react";
import logo from "../../assets/images/logo.svg";
import "../../styles/slider.css";
import style from "./Login.module.css";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const TEST = gql`
  query MyQuery {
    client {
      id
      name
    }
  }
`;

export default function Login() {
  const { data, error } = useQuery(TEST);

  if (data) {
    alert(data);
  }

  return (
    <section className="auth-section">
      <div className="greenbox"></div>
      <div className="login shadow rounded">
        <div className="login-content padding">
          <img src={logo} width="222" height="26.21" alt="" />
          <p className="bigtext">Login</p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form className={style.form} onSubmit={handleSubmit}>
                <label className="smalltext" htmlFor="email">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <p className={style.error}>
                  {errors.email && touched.email && errors.email}
                </p>
                <label className="smalltext" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password && errors.password}
                <div className="login-buttons">
                  <button type="submit" className="button-login">
                    Login
                  </button>
                  <button className="button-register">
                    <Link className="link" to="/registerClient">
                      Register
                    </Link>
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
}
