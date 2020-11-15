import React from "react";
import logo from "../../assets/images/logo.svg";
import "../../styles/slider.css";
import style from "../authentication/Login.module.css";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

const REGISTER_CLIENT = gql`
  mutation myMutation($user: UserInput!) {
    signUp(user: $user) {
      token
    }
  }
`;

export default function RegisterClient() {
  const [REGISTER] = useMutation(REGISTER_CLIENT);

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
              dob: "",
              postal: "",
              city: "",
              profession: "",
              weight: "",
              length: "",
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
              alert("hi");
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
                    profession: values.profession,
                    weight: values.weight,
                    height: values.height,
                    phone: values.phone,
                    coach: false,
                  },
                },
              });
              console.log(errors);
              alert(data.signUp.token);

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

                <label className="smalltext" htmlFor="length">
                  Length
                </label>
                <input
                  type="number"
                  name="length"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.length}
                />
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
