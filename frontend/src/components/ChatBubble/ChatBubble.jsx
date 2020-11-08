import React from 'react'
import style from './ChatBubble.module.css'

export function ChatBubbleMe({text}) {
    return (
        <div className={style.left}>
        <div className={style.me}>
            {text}
            <span>27/07/12:30</span>
        </div>
        </div>
    )
}

export function ChatBubbleOther({text}) {
    return (
        <div className={style.right}>
        <div className={style.other}>
            {text}
            <span>27/07/12:30</span>
        </div>
        </div>
    )
}
