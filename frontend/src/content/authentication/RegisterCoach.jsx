import React from "react";
import style from "../authentication/Login.module.css";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { useStoreActions } from "easy-peasy";
import { useMutation, gql } from "@apollo/client";
import jwt_decode from "jwt-decode";

const REGISTER_CLIENT = gql`
  mutation myMutation($user: UserInput!) {
    signUp(user: $user) {
      token
    }
  }
`;

export default function RegisterCoach() {
  const [REGISTER] = useMutation(REGISTER_CLIENT);

  const addToken = useStoreActions((actions) => actions.addToken);
  const addRoles = useStoreActions((actions) => actions.addRoles);

  const deleteToken = useStoreActions((actions) => actions.deleteToken);

  return (
    <section className="auth-section">
      <div className="greenbox"></div>
      <div className="login shadow rounded">
        <div className="login-content padding">
          <img src={logo} width="222" height="26.21" alt="" />

          <Formik
            initialValues={{
              email: "",
              surname: "",
              name: "",
              password: "",
              confirmPassword: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (values.password !== values.confirmPassword) {
                errors.password = "Passwords not matching";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              deleteToken();
              const { errors, data } = await REGISTER({
                variables: {
                  user: {
                    email: values.email,
                    password: values.password,
                    surname: values.surname,
                    name: values.name,
                    coach: true,
                  },
                },
              });

              console.log(errors);
              if (!errors) {
                console.log("Received JWT token");
                addToken(data.signUp.token);
                console.log("Token has been added to store");
                console.log(jwt_decode(data.signUp.token));
                const decoded = jwt_decode(data.signUp.token);

                console.log(
                  "Allowed roles: " +
                    decoded["https://hasura.io/jwt/claims"][
                      "x-hasura-allowed-roles"
                    ]
                );
                const roles =
                  decoded["https://hasura.io/jwt/claims"][
                    "x-hasura-allowed-roles"
                  ];
                addRoles(roles);
                console.log(roles);
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
                <label className="smalltext" htmlFor="surname">
                  Surname
                </label>
                <input
                  type="text"
                  name="surname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.surname}
                />

                <label className="smalltext" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
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
                <label className="smalltext" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                />
                {errors.password && touched.password && errors.password}
                <div className="login-buttons">
                  <button type="submit" className="button-login">
                    Register
                  </button>
                  <button className="button-register">
                    <Link className="link" to="/login">
                      I already have an account
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
