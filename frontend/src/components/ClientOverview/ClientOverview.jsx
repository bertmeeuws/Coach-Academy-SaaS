import React from "react";
import { Link } from "react-router-dom";
import Image from "../../assets/images/profile.png";
import Email from "../../assets/images/email.png";
import Phone from "../../assets/images/phone.png";

export default function ClientOverview({ client }) {
  if (client === undefined) {
    return <section className="client-overview rounded shadow"></section>;
  } else {
    const { surname, name, dob, address, postal, city, phone, email } = client;
    console.log("Client: " + client);

    return (
      <section className="client-overview rounded shadow">
        <div className="client-overview-background">
          
          
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
