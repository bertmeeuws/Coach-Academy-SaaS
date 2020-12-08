import React from "react";
import logo from "../../assets/images/logo.svg";
import "../../styles/slider.css";
import "../../styles/authentication.css";
import { Formik } from "formik";
import { Link, Redirect } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { useStoreActions, useStoreState } from "easy-peasy";
import jwt_decode from "jwt-decode";

const REGISTER_CLIENT = gql`
  mutation myMutation($user: UserInput!) {
    signUp(user: $user) {
      token
    }
  }
`;

export default function RegisterClient(props) {
  const [REGISTER] = useMutation(REGISTER_CLIENT);

  const addToken = useStoreActions((actions) => actions.addToken);
  const addRoles = useStoreActions((actions) => actions.addRoles);
  const deleteToken = useStoreActions((actions) => actions.deleteToken);
  const rolesInState = useStoreState((state) => state.roles);
  const addId = useStoreActions((actions) => actions.addId);

  if (rolesInState.includes("client")) {
    return <Redirect to="/clientdashboard" />;
  }
  if (rolesInState.includes("coach")) {
    return <Redirect to="/dashboard" />;
  }

  console.log(rolesInState);

  return (
    <section className="auth-section">
      <div className="greenbox"></div>
      <div className="register shadow rounded">
        <div className="login-content padding">
          <img src={logo} width="222" height="26.21" alt="" />

          <Formik
            initialValues={{
              email: "",
              surname: "",
              name: "",
              dob: "",
              postal: "",
              city: "",
              profession: "",
              weight: "",
              height: "",
              phone: "",
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
                    address: values.address,
                    dob: values.dob,
                    postal: values.postal,
                    city: values.city,
                    phone: values.phone,
                    profession: values.profession,
                    weight: values.weight,
                    height: values.height,
                    coach: false,
                  },
                },
              });

              console.log(errors);
              if (!errors) {
                console.log("Received JWT token");
                addToken(data.signUp.token);
                console.log("Token has been added to store");

                const decoded = jwt_decode(data.signUp.token);
                //
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
                const id = Number(
                  decoded["https://hasura.io/jwt/claims"]["x-hasura-client-id"]
                );

                //Adding roles and id to state

                addId(id);
                addRoles(roles);
                //console.log(roles);
                this.props.history("/clientdashboard");
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
              <form className="client-register-form" onSubmit={handleSubmit}>
                <div className="client-register-container">
                  <div className="client-register-input surname">
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
                  </div>
                  <div className="client-register-input name">
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
                  </div>
                  <div className="client-register-input email">
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
                    <p className="register-client-error">
                      {errors.email && touched.email && errors.email}
                    </p>
                  </div>
                  <div className="client-register-input address">
                    <label className="smalltext" htmlFor="address">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                    />
                  </div>
                  <div className="client-register-input dpb">
                    <label className="smalltext" htmlFor="dob">
                      DOB
                    </label>
                    <input
                      type="date"
                      name="dob"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.dob}
                    />
                  </div>
                  <div className="client-register-input postal">
                    <label className="smalltext" htmlFor="postal">
                      Postal
                    </label>
                    <input
                      type="number"
                      name="postal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.postal}
                    />
                  </div>

                  <div className="client-register-input city">
                    <label className="smalltext" htmlFor="city">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.city}
                    />
                  </div>
                  <div className="client-register-input profession">
                    <label className="smalltext" htmlFor="profession">
                      Profession
                    </label>
                    <input
                      type="text"
                      name="profession"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.profession}
                    />
                  </div>
                  <div className="client-register-input weight">
                    <label className="smalltext" htmlFor="weight">
                      Weight
                    </label>
                    <input
                      type="number"
                      name="weight"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.weight}
                    />
                  </div>
                  <div className="client-register-input length">
                    <label className="smalltext" htmlFor="length">
                      Length
                    </label>
                    <input
                      type="number"
                      name="height"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.height}
                    />
                  </div>
                  <div className="client-register-input phone">
                    <label className="smalltext" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                  </div>
                  <div className="client-register-input password">
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
                  </div>
                  <div className="client-register-input passwordConfirm">
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
                  </div>
                </div>
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
