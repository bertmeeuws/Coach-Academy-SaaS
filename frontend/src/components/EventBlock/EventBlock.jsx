import React from 'react'
import style from '../EventBlock/EventBlock.module.css'

export default function EventBlock({start, end, description, clicked}) {
    return (
        
        <div onClick={clicked} className={style.block}>
            {start} - {end} {description}
        </div>
        
    
    )
}
