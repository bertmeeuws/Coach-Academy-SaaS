import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState } from "easy-peasy";
import { useQuery, gql, useMutation, useLazyQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import "../../styles/edit.css";

const GET_USER_DATA = gql`
  query GetDataUser($id: Int!) {
    client(where: { user_id: { _eq: $id } }, limit: 1) {
      name
      weight
      coach_id
      surname
      profession
      postal
      phone
      height
      dob
      address
      city
    }
  }
`;

const CHANGE_USER_DATA = gql`
  mutation UpdateSurvey($where: client_bool_exp!, $set: client_set_input!) {
    update_client(_set: $set, where: $where) {
      returning {
        address
        city
        dob
        height
        name
        phone
        postal
        profession
        surname
      }
    }
  }
`;

export default function Edit() {
  const id = useStoreState((state) => state.user_id);

  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [profession, setProfession] = useState("");
  const [height, setHeight] = useState("");
  const [phone, setPhone] = useState("");

  const [fetchUserData, { data: userData }] = useLazyQuery(GET_USER_DATA, {
    variables: {
      id: id,
    },
  });

  const [MUTATE_DATA] = useMutation(CHANGE_USER_DATA, {
    variables: {
      where: {
        user_id: { _eq: id },
      },
      set: {
        name: name,
        surname: surname,
        city: city,
        postal: postal,
        address: address,
        postal: postal,
        dob: dob,
        height: height,
        phone: phone,
      },
    },
  });

  useEffect(() => {
    if (userData) {
      if (userData.client.length !== 0) {
        console.log(userData.client[0]);
        const {
          address,
          city,
          postal,
          name,
          surname,
          dob,
          height,
          profession,
          phone,
        } = userData.client[0];
        setSurname(surname);
        setName(name);
        setAddress(address);
        setPostal(postal);
        setCity(city);
        setDob(dob);
        setHeight(height);
        setProfession(profession);
        setPhone(phone);
      } else {
        console.log("Client was fetched but no data has been found");
      }
    } else {
      fetchUserData();
    }
  }, userData);

  const submitEditProfile = async (e) => {
    e.preventDefault();
    const { data: changedData } = await MUTATE_DATA();
    console.log(changedData.update_client.returning[0]);

    if (changedData.update_client.returning.length !== 0) {
      const {
        address,
        city,
        postal,
        name,
        surname,
        dob,
        height,
        profession,
        phone,
      } = changedData.update_client.returning[0];

      setSurname(surname);
      setName(name);
      setAddress(address);
      setPostal(postal);
      setCity(city);
      setDob(dob);
      setHeight(height);
      setProfession(profession);
      setPhone(phone);
    } else {
      console.log("No returned data after mutation");
    }
  };

  return (
    <div>
      <MobileHeader />
      <section className="section client-edit">
        <h1 className="client-edit-hero">Edit your profile</h1>
        <p className="client-edit-subtext">
          Has some of your information changed? Let the coach know.
        </p>
        <form onSubmit={submitEditProfile} className="client-edit-form">
          <div className="client-edit-grid">
            <div className="client-edit-form-input">
              <p className="smalltext">Surname</p>
              <input
                required
                value={surname}
                onChange={(e) => setSurname(e.currentTarget.value)}
                type="text"
              />
            </div>
            <div className="client-edit-form-input">
              <p className="smalltext">Name</p>
              <input
                required
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                type="text"
              />
            </div>
            <div className="client-edit-form-input">
              <p className="smalltext">Address</p>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.currentTarget.value)}
                type="text"
              />
            </div>
            <div className="client-edit-form-input">
              <p className="smalltext">Postal</p>
              <input
                required
                value={postal}
                onChange={(e) => setPostal(e.currentTarget.value)}
                type="number"
              />
            </div>
            <div className="client-edit-form-input">
              <p className="smalltext">City</p>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
                type="text"
              />
            </div>
            <div className="client-edit-form-input">
              <p className="smalltext">Dob</p>
              <input
                required
                value={dob}
                onChange={(e) => setDob(e.currentTarget.value)}
                type="date"
              />
            </div>
            <div className="client-edit-form-input">
              <p className="smalltext">Profession</p>
              <input
                required
                value={profession}
                onChange={(e) => setProfession(e.currentTarget.value)}
                type="text"
              />
            </div>
            <div className="client-edit-form-input">
              <p className="smalltext">Height (cm)</p>
              <input
                required
                value={height}
                onChange={(e) => setHeight(e.currentTarget.value)}
                type="number"
              />
            </div>
            <div className="client-edit-form-input last">
              <p className="smalltext">Phone</p>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
                type="text"
              />
            </div>
          </div>
          <input
            type="submit"
            className="client-edit-form-button rounded shadow"
            value="Submit changes"
          />
        </form>
      </section>
    </div>
  );
}
