import React from 'react'

export default function InboxEmail() {
    return (
        <div className="inbox-email rounded shadow">
            <div className="mail-avatar smalltext"></div>
            <p className="mail-sender">Lisa Meeuws</p>
            <p className="mail-time">12 min ago</p>
            <h2 className="mail-subject">Problem with program</h2>
            <p className="mail-shortcontent">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum ultrices justo blandit facilisis.</p>
        </div>
    )
}
