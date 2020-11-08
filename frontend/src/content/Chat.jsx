import React from 'react'
import '../styles/chat.css';
import Search from '../components/SearchBar/SearchBar';
import InboxEmail from '../components/InboxEmail/InboxEmail';
import ProfilePic from "../components/ProfilePic/ProfilePic";
import ChatIcon from '../assets/images/svg/chaticon.svg';
import Message from '../assets/images/svg/message.svg';
import Dumbell from '../assets/images/svg/dumbell.svg';
import Meds from '../assets/images/svg/meds.svg';
import Apple from '../assets/images/svg/Apple.svg';
import {Link} from 'react-router-dom'
import {ChatBubbleMe, ChatBubbleOther} from '../components/ChatBubble/ChatBubble'
import "../styles/chat.css"



export default function Chat() {
    return (
        <section className="chat">
        <Search />
        <div className="chat-online">
            <ProfilePic />
            <ProfilePic />
            <ProfilePic />
            <ProfilePic />
        </div>
        <div className="chat-converstations">
        <InboxEmail/>
        <InboxEmail/>
        </div>
        <div className="chat-chat rounded shadow">
            <div className="chat-header">
            <div className="chat-header-left">
            <ProfilePic />
            <p className="chat-header-title">Melanie Devisser</p>
            </div>
            <div className="chat-header-right">
                <Link><img src={ChatIcon} alt=""/></Link>
                <Link><img src={Message} alt=""/></Link>
                <Link><img src={Dumbell} alt=""/></Link>
                <Link><img src={Meds} alt=""/></Link>
                <Link><img src={Apple} alt=""/></Link>
                </div>
            </div>
            <div className="chat-content">
            <ChatBubbleMe text="hiya"/>
            <ChatBubbleOther text="hiya"/>
            <ChatBubbleMe text="hiya"/>
            <ChatBubbleOther text="hiya"/>
            <ChatBubbleMe text="loremfdifhjidpjfpidsjfs"/>
            <ChatBubbleMe text="loremfdifhjidpjfpidsjfs"/>
            </div>
        </div>

        </section>
    )
}
