import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState, useStoreActions } from "easy-peasy";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import "../../styles/edit.css";
import Upload from "../../assets/images/svg/upload.svg";
import Dummy from "../../assets/images/profile1.jpg";

import axios from "axios";

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
      user {
        avatars(limit: 1, order_by: { id: desc }) {
          key
          mimetype
          originalName
          id
        }
      }
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

const UPLOAD_FILE = gql`
  mutation insert_avatars($file: avatars_insert_input!) {
    insert_avatars(objects: [$file]) {
      returning {
        id
      }
    }
  }
`;

export default function Edit() {
  const id = useStoreState((state) => state.user_id);

  const profile_pic = useStoreState((state) => state.profile_pic);

  const ADD_AVATAR_STORE = useStoreActions((actions) => actions.addProfilePic);

  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [profession, setProfession] = useState("");
  const [height, setHeight] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(profile_pic);
  const [filePath, setFilePath] = useState(null);

  const [INSERT_FILE] = useMutation(UPLOAD_FILE);

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

        dob: dob,
        height: height,
        phone: phone,
      },
    },
  });

  const fetchURL = async (data) => {
    console.log(data);
    //console.log(item);
    axios
      .get("https://174.138.12.116:5000/storage/file" + data.key)
      .then((response) => {
        setFile(response.data.viewingLink);
        console.log(response.data.viewingLink);
        ADD_AVATAR_STORE(response.data.viewingLink);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("Test");

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
          user,
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
        if (user.avatars.length !== 0) {
          fetchURL(user.avatars[0]);
        }
      } else {
        console.log("Client was fetched but no data has been found");
      }
    } else {
      fetchUserData();
    }
  }, [userData, fetchURL(), fetchUserData()]);

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

    if (filePath !== null) {
      const form_data = new FormData();
      form_data.append("files", filePath);

      console.log(form_data);

      const response = await axios.post(
        `https://174.138.12.116:5000/storage/upload`,
        form_data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-path": "/upload-folder",
          },
          withCredentials: true,
        }
      );
      //console.log({ response });

      const inserted_file = response.data[0];
      console.log(inserted_file);

      const { data } = await INSERT_FILE({
        variables: {
          file: {
            key: inserted_file.key,
            mimetype: inserted_file.mimetype,
            originalName: inserted_file.originalname,
            user_id: id,
          },
        },
      });
      console.log(data);
      ADD_AVATAR_STORE(file);
    }
  };

  return (
    <div>
      <MobileHeader />
      <section className="section client-edit">
        <h1 className="client-edit-hero">Edit your profile</h1>
        <form onSubmit={submitEditProfile} className="client-edit-form">
          <div className="client-edit-form-avatar">
            <img
              className="profilePic shadow"
              src={file === null ? Dummy : file}
              alt=""
              height="88"
              width="88"
            />
            <input
              type="file"
              id="file"
              onChange={(e) => {
                setFile(URL.createObjectURL(e.target.files[0]));
                setFilePath(e.target.files[0]);
              }}
              style={{ display: "none" }}
            />
            <label htmlFor="file">
              <img
                id="file"
                src={Upload}
                className="shadow button"
                width="23"
                height="23"
                alt=""
              />
            </label>
          </div>
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
