import React from "react";
import { Link } from "react-router-dom";

export default function ClientOverview({ client }) {
  if (client === undefined) {
    return <section className="client-overview rounded shadow"></section>;
  } else {
    const { surname, name, dob, address, postal, city, email, phone } = client;
    console.log("Client: " + client);

    return (
      <section className="client-overview rounded shadow">
        <div className="client-overview-circle"></div>
        <h1 className="subtitle name">
          {surname} {name}
        </h1>
        <p className="normaltext dob">{dob}</p>
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
          <span className="normaltext">mail@gmail.com</span>
          <span className="normaltext">{phone}</span>
          <Link to={`client/${client.id}`}>Go to doc</Link>
        </div>
      </section>
    );
  }
}
