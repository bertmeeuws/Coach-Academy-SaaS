import React, { useEffect } from "react";
import logo from "../../assets/images/logo.svg";
import "../../styles/slider.css";
import style from "./Login.module.css";
import { Formik } from "formik";
import { Link, Redirect } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import jwt_decode from "jwt-decode";
import { useMutation, gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation LoginIn($user: UserInputLogin!) {
    login(user: $user) {
      token
    }
  }
`;

export default function Login() {
  const [LOGIN] = useMutation(LOGIN_MUTATION);

  const addToken = useStoreActions((actions) => actions.addToken);
  const addRoles = useStoreActions((actions) => actions.addRoles);
  const deleteToken = useStoreActions((actions) => actions.deleteToken);
  const addId = useStoreActions((actions) => actions.addId);

  const rolesInState = useStoreState((state) => state.roles);

  if (rolesInState.includes("client")) {
    return <Redirect to="/clientdashboard" />;
  }
  if (rolesInState.includes("coach")) {
    return <Redirect to="/dashboard" />;
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
            onSubmit={async (values, { setSubmitting }) => {
              deleteToken();
              const { data, errors } = await LOGIN({
                variables: {
                  user: {
                    email: values.email,
                    password: values.password,
                  },
                },
              });

              if (errors && !data) {
                console.log(errors);
              }
              if (!errors && data) {
                console.log("Received JWT token");
                if (!data.login.token) {
                  console.log("Token problem");
                }
                addToken(String(data.login.token));
                console.log("Token has been added to store");

                const decoded = jwt_decode(data.login.token);

                const roles =
                  decoded["https://hasura.io/jwt/claims"][
                    "x-hasura-allowed-roles"
                  ];
                const id = Number(
                  decoded["https://hasura.io/jwt/claims"]["x-hasura-client-id"]
                );

                //Adding roles and id to state

                addRoles(roles);
                addId(id);
              }

              setTimeout(() => {
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
