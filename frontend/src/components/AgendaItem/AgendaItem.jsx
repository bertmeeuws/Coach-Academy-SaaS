import React from 'react'

export default function AgendaItem() {
    return (
        <div className="agenda-item">
            <div className="agenda-item-time">
                <span className="bigtext">10:30</span>
                <span className="normaltext">11:00</span>
            </div>
            <div className="bar"></div>
            <div className="agenda-item-information">
                <span className="bigtext">Check in</span>
                <span className="bigtext">Lisa</span>
            </div>
        </div>
    )
}
