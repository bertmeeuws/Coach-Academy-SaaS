import React from "react";
import logo from "../../assets/images/logo.svg";
import style from "../Sidebar/Sidebar.module.css";
import Logout from "../../assets/images/svg/Logout.svg";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useStoreActions } from "easy-peasy";

import {
  Dashboard,
  Calendar,
  Chat,
  Clients,
  Inbox,
  Settings,
  Todos,
} from "../Icons/";

export default function Sidebar() {
  const location = useLocation();

  const deleteToken = useStoreActions((actions) => actions.deleteToken);

  const logout = (e) => {
    deleteToken();
  };

  return (
    <div className={style.sidebar}>
      <img
        src={logo}
        className={style.logo}
        width="222"
        height="26.21"
        alt="Logo coachacademy"
      />
      <div>
        <div className={style.list}>
          <p className={style.smalltext}>Personal</p>
          <ul className={style.grid}>
            <Link className="link" to="/dashboard">
              <li
                style={
                  location.pathname.includes("dashboard")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
                className="nav-active"
              >
                <Dashboard
                  color={
                    location.pathname.includes("dashboard")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>Dashboard</span>
              </li>
            </Link>
            <Link className="link" to="/inbox">
              <li
                style={
                  location.pathname.includes("inbox")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
              >
                <Inbox
                  color={
                    location.pathname.includes("inbox")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>Inbox</span>
              </li>
            </Link>
            <Link className="link" to="/calendar">
              <li
                style={
                  location.pathname.includes("calendar")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
              >
                <Calendar
                  color={
                    location.pathname.includes("calendar")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>Calendar</span>
              </li>
            </Link>
            <Link className="link" to="/todos">
              <li
                style={
                  location.pathname.includes("todos")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
              >
                <Todos
                  color={
                    location.pathname.includes("todos")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>To do's</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className={style.list}>
          <p className={style.smalltext}>Clients</p>
          <ul className={style.grid}>
            <Link className="link" to="/clients">
              <li
                style={
                  location.pathname.includes("clients")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
              >
                <Clients
                  color={
                    location.pathname.includes("clients")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>Clients</span>
              </li>
            </Link>
            <Link className="link" to="/chat">
              <li
                style={
                  location.pathname.includes("chat")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
              >
                {" "}
                <Chat
                  color={
                    location.pathname.includes("chat")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>Chat</span>
              </li>
            </Link>
            <Link className="link" to="/documents">
              {" "}
              <li
                style={
                  location.pathname.includes("documents")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
              >
                <Todos
                  color={
                    location.pathname.includes("documents")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>Documents</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className={style.bottom}>
          <ul className={style.grid}>
            <Link className="link" to="/settings">
              <li
                style={
                  location.pathname.includes("settings")
                    ? { backgroundColor: "var(--green)" }
                    : { color: "var(--darkblue)" }
                }
              >
                <Settings
                  color={
                    location.pathname.includes("settings")
                      ? "var(--white)"
                      : "var(--darkblue)"
                  }
                />
                <span>Settings</span>
              </li>
            </Link>
            <Link onClick={logout()} className="link" to="/login">
              <li
                style={{
                  color: "var(--darkblue)",
                  backgroundColor: "var(--ghost)",
                }}
              >
                <img src={Logout} alt="" />
                Logout
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
