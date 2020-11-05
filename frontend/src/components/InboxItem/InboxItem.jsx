import React from 'react'
import Check from '../../assets/images/svg/Check.svg'
import style from "../InboxItem/InboxItem.module.css"

export default function InboxItem() {
    return (
        <>
        <div className={style.flex}>
        <div className="inbox-circle todoitem-circle shadow InboxItem-flex"></div>
            <p className="normaltext">John Smith</p>
        </div>
        <p className="normaltext InboxItem-flex">Need a change in my program</p>
            <div className={style.flex}>
            <img src={Check} width="30" height="30" alt=""/>
            <p className="inbox-reply normaltext">Reply</p>
        </div>
        </>
    )
}
