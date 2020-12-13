import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import Dummy from "../../assets/images/profile1.jpg";
import Image from "../../assets/images/profile.png";
import Email from "../../assets/images/email.png";
import Phone from "../../assets/images/phone.png";

const GENERATE_LINK = gql`
  mutation MyQuery($key: String!) {
    getS3ImageUrl(key: $key) {
      viewingLink
    }
  }
`;

export default function ClientOverview({ client }) {
  const [GET_IMAGES] = useMutation(GENERATE_LINK);
  const [pic, setPic] = useState(undefined);

  console.log(client);

  useEffect(async () => {
    if (client !== undefined) {
      if (client.user.avatars.length !== 0) {
        const { data, errors } = await GET_IMAGES({
          variables: {
            key: client.user.avatars[0].key,
          },
        });

        if (!errors) {
          setPic(data.getS3ImageUrl.viewingLink);
        } else {
          setPic(null);
        }
      } else {
        setPic(null);
      }
    }
  }, [client]);

  if (client === undefined) {
    return <section className="client-overview rounded shadow"></section>;
  } else {
    const {
      surname,
      name,
      dob,
      address,
      postal,
      city,
      phone,
      email,
      user,
    } = client;

    if (pic === undefined) {
      return <></>;
    }

    return (
      <section className="client-overview rounded shadow">
        <div className="client-overview-background">
          <img
            height="100"
            width="100"
            src={pic === null ? Dummy : pic}
            alt=""
          />
          <div className="client-overview-right">
            <h1 className="subtitle name">
              {surname} {name}
            </h1>
            <p className="normaltext dob">{dob}</p>
          </div>
        </div>

        <div className="client-overview-grid">
          <div className="client-overview-block address">
            <span className="smalltext">ADDRESS</span>
            <span className="normaltext">{address}</span>
          </div>
          <div className="client-overview-block postal">
            <span className="smalltext">POSTAL</span>
            <span className="normaltext">{postal}</span>
          </div>
          <div className="client-overview-block city">
            <span className="smalltext">CITY</span>
            <span className="normaltext">{city}</span>
          </div>
          <div className="client-overview-block age">
            <span className="smalltext">AGE</span>
            <span className="normaltext">20 Jaar</span>
          </div>
        </div>
        <div className="client-overview-block">
          <span className="smalltext">CONTACT INFORMATION</span>
          <span className="normaltext">
            <img src={Email} alt="" />
            {email}
          </span>
          <span className="normaltext">
            <img src={Phone} alt="" />
            {phone}
          </span>
          <Link
            className="shadow client-overview-button"
            to={`client/${client.id}`}
          >
            View client
          </Link>
        </div>
      </section>
    );
  }
}
