import React, {useState} from 'react'
import "../../styles/client.css"
import Questionnaire from "../../components/Questionnaire/Questionnaire"
import {Link} from 'react-router-dom'

export default function dashboard() {


    const [checked, setChecked] = useState(undefined)



    return (
        <section className="section client-dashboard">
                <header className="client-header">
                    <p className="header-date">Tuesday, 10 November 2020</p>
                    <Link><div className="header-profile"></div></Link>
                </header>
                <h1 className="client-dashboard-hero">Welcome Bert!</h1>
                <p className="client-dashboard-subtext">Let's start achieving your goals.</p>
                <div className="client-weight">
                    <p className="client-weight-title">How much did you weigh this morning?</p>
                    <input className="client-weight-input" type="text"/>
                    <button className="client-weight-button">Confirm</button>
                </div>
                <div className="client-questionnaire">
                    <div className="cravings">
                    <Questionnaire name="cravings" onChange={console.log("hi")} />
                    </div>
                </div>
        </section>
    )
}
