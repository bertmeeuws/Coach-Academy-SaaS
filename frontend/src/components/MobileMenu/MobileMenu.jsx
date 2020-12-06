import React from "react";
import "../../styles/mobilemenu.css";
import Logo from "../../assets/images/logo.svg";
import { Link, Redirect } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";

export default function MobileMenu({ clicked }) {
  const deleteToken = useStoreActions((actions) => actions.deleteToken);

  const token = useStoreState((state) => state.apollotoken);

  if (token === undefined) {
    return <Redirect to="/login" />;
  }

  const logout = (e) => {
    deleteToken();
  };

  return (
    <div className="mobile-menu shadow">
      <div className="mobile-menu-header">
        <img className="mobile-menu-logo" src={Logo} alt="" />
      </div>
      <p className="smalltext">Menu</p>
      <ul className="menu-list">
        <Link to="/clientdashboard" onClick={clicked} className="link">
          <li className="menu-list-item rounded">
            <span>Dashboard</span>
          </li>
        </Link>
        <Link onClick={clicked} to="/clientprogress" className="link">
          <li className="menu-list-item rounded">
            <span>Progress</span>
          </li>
        </Link>
        <Link onClick={clicked} className="link">
          <li className="menu-list-item rounded">
            <span>Workout</span>
          </li>
        </Link>
        <Link to="/clientdiet" onClick={clicked} className="link">
          <li className="menu-list-item rounded">
            <span>Diet</span>
          </li>
        </Link>
        <Link onClick={clicked} className="link">
          <li className="menu-list-item rounded">
            <span>Calendar</span>
          </li>
        </Link>
        <Link to="/clientedit" onClick={clicked} className="link">
          <li className="menu-list-item rounded">
            <span>Edit profile</span>
          </li>
        </Link>
        <Link to="/clientsettings" onClick={clicked} className="link">
          <li className="menu-list-item rounded">
            <span>Settings</span>
          </li>
        </Link>
        <Link onClick={clicked} onClick={logout} className="link">
          <li className="menu-list-item rounded">
            <span>Logout</span>
          </li>
        </Link>
      </ul>
    </div>
  );
}
