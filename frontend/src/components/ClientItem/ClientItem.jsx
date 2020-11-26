import React from "react";


export default function ClientItem({ onClick, surname, name, id }) {
  return (
    
    <div onClick={onClick} data-id={id} className="clientItem rounded shadow">
      <div className="clientItem-container">
        <div className="clientItem-circle"></div>
        <p className="normaltext">
          {surname} {name}
        </p>
      </div>
      <div className="clientItem-container">
        <p className="normaltext">Active</p>
      </div>
    </div>
  );
}
