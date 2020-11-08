import React from 'react'
import '../styles/inbox.css'
import InboxEmail from '../components/InboxEmail/InboxEmail'


export default function Inbox() {
    return (

        <section className="inbox-section">
            <div className="inbox-header">
                <p className="inbox-unread">10 Unread mails</p>
                <button className="inbox-new rounded shadow">New mail</button>
            </div>
            <div className="inbox-grid-content">
                <div className="inbox-grid-left rounded shadow">
                    <div className="inbox-options">
                        <span className="inbox-option">Inbox</span>
                        <span className="inbox-option">Sent</span>
                    </div>
                    <InboxEmail/>
                    <InboxEmail/>
                    <InboxEmail/>
                    
                </div>
                <div className="inbox-grid-right rounded shadow">
                    <div className="inbox-mailView">
                        <div className="mailView-header">
                        <div className="mailView-sender">
                            <span className="smalltext">NAME</span>
                            <span className="bigtext">Lisa Meeuws</span>
                        </div>
                        <div className="mailView-metadata">
                            
                            <p>2 October, 2020 10:24</p>
                            <div className="mailView-metaData-avatar"></div>
                            
                        </div>
                        <div className="mailView-subject">
                            <span className="smalltext">SUBJECT</span>
                            <span className="bigtext">Problem with program</span>
                        </div>
                        </div>
                        <div className="mailView-content">
                        <p className="mailView-content-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum ultrices justo blandit facilisis. Nam vitae luctus justo. Curabitur libero ante, rutrum lacinia pretium eu, tristique vitae felis. Curabitur in congue nulla. Pellentesque quam augue, congue in interdum sit amet, blandit nec justo. Quisque mattis, neque sit amet finibus elementum, urna lacus ultrices sem, ullamcorper pharetra nisi nulla vitae nunc. Nullam semper ligula urna, eget dapibus elit convallis sit amet. Duis a dictum enim, non sollicitudin lacus. Fusce eget mauris vel nisi sollicitudin porta vel id orci. In venenatis pellentesque eros id convallis. Mauris ac bibendum nibh, ac tempus eros. Vestibulum ut enim eu turpis elementum mollis. Etiam dictum, dolor a venenatis sagittis, felis libero bibendum leo, ut hendrerit est nibh ut lacus. Etiam iaculis sem nibh, a malesuada nulla posuere quis.</p>
                        
                        </div>
                    </div>
                    <button className="mailView-reply sahdow">Reply</button>
                </div>
            </div>

        </section>
    )
}
