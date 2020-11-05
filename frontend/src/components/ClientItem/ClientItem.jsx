import React from 'react'
import Chat from '../../assets/images/svg/chaticon.svg'
import Message from '../../assets/images/svg/message.svg'
import Dumbell from '../../assets/images/svg/dumbell.svg'
import Meds from '../../assets/images/svg/meds.svg'
import Apple from '../../assets/images/svg/Apple.svg'
import {Link} from 'react-router-dom'

export default function ClientItem() {
    return (
        <div className="clientItem rounded shadow">
            <div className="clientItem-container">
            <div className="clientItem-circle"></div>
            <p className="normaltext">Maxime Vercruysse</p>
            </div>
            <div className="clientItem-container"> 
            <p className="normaltext">Active</p>
            </div>
            <div className="clientItem-actions clientItem-container">
                <Link><img src={Chat} alt=""/></Link>
                <Link><img src={Message} alt=""/></Link>
                <Link><img src={Dumbell} alt=""/></Link>
                <Link><img src={Meds} alt=""/></Link>
                <Link><img src={Apple} alt=""/></Link>
            </div>
        </div>
    )
}
