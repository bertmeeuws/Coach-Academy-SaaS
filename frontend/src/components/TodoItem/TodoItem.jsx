import React from 'react'
import Check from '../../assets/images/svg/Check.svg'

export default function TodoItem() {
    return (
        <li className="TodoItem-grid">
            <div className="todoitem-circle shadow"></div>
            <p className="bigtext todoitem-text">Program renewal</p>
            <img src={Check} width="30" height="30" alt=""/>
        </li>
    )
}
