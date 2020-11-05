import React from 'react'
import logo from "../../assets/images/logo.svg"
import style from "../Sidebar/Sidebar.module.css"
import Calendar from "../../assets/images/svg/Calendar.svg"
import Chat from "../../assets/images/svg/Chat.svg"
import Clients from "../../assets/images/svg/Clients.svg"
import Files from "../../assets/images/svg/Files.svg"
import Inbox from "../../assets/images/svg/Inbox.svg"
import Logout from "../../assets/images/svg/Logout.svg"
import Settings from "../../assets/images/svg/Settings.svg"
import Todos from "../../assets/images/svg/Todos.svg"
import Dashboard from "../../assets/images/svg/Dashboard.svg"
import {Link} from "react-router-dom"

export default function Sidebar() {
    return (
        <div className={style.sidebar}>
            <img src={logo} className={style.logo} width="222" height="26.21" alt="Logo coachacademy"/>
            <div>
            <div className={style.list}>
                <p className={style.smalltext}>Personal</p>
                <ul className={style.grid}>
                    <li><img src={Dashboard} alt=""/><Link className="link" to="/dashboard">Dashboard</Link></li>
                    <li><img src={Inbox} alt=""/><Link className="link" to="/inbox">Inbox</Link></li>
                    <li><img src={Calendar} alt=""/><Link className="link" to="/calendar">Calendar</Link></li>
                    <li><img src={Todos} alt=""/><Link  className="link"to="/todos">Todos</Link></li>
                    
                </ul>
            </div>
            <div className={style.list}>
                <p className={style.smalltext}>Clients</p>
                <ul className={style.grid}>
                    <li><img src={Clients} alt=""/><Link className="link" to="/clients">Clients</Link></li>
                    <li><img src={Chat} alt=""/><Link className="link" to="/chat">Chat</Link></li>
                    <li><img src={Files} alt=""/><Link className="link" to="/documents">Documents</Link></li>
                </ul>
            </div>
            <div className={style.bottom}>
            <ul className={style.grid}>
            <li><img src={Settings} alt=""/><Link className="link" to="/settings">Settings</Link></li>
            <li><img src={Logout} alt=""/><Link className="link" to="/login">Logout</Link></li></ul>
            </div>
            </div>
        </div>
    )
}
