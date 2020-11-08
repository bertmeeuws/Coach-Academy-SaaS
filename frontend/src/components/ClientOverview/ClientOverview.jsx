import React from 'react'

export default function ClientOverview() {
    return (
        <section className="client-overview rounded shadow">
             
        <div className="client-overview-circle"></div>
        <h1 className="subtitle name">Maxime Vercruysse</h1>
        <p className="normaltext dob">20/06/1995</p>
        <div className="client-overview-grid">
        <div className="client-overview-block address">
            <span className="smalltext">ADDRESS</span>
            <span className="normaltext">Potagierstraat 5</span>
        </div>
        <div className="client-overview-block postal">
            <span className="smalltext">POSTAL</span>
            <span className="normaltext">8000</span>
        </div>
        <div className="client-overview-block city">
            <span className="smalltext">CITY</span>
            <span className="normaltext">Koolkerke</span>
        </div>
        <div className="client-overview-block age">
            <span className="smalltext">AGE</span>
            <span className="normaltext">20 Jaar</span>
        </div>
        </div>
        <div className="client-overview-block">
            <span className="smalltext">CONTACT INFORMATION</span>
            <span className="normaltext">mail@gmail.com</span>
            <span className="normaltext">04 922 44423 78</span>
        </div>
        </section>
    )
}
