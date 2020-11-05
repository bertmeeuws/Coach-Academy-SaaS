import React from 'react'
import style from "../Header/Header.module.css"
import Alarm from "../../assets/images/svg/Alarm.svg"
import Todo from "../../assets/images/svg/Todo.svg"
import Me from "../../assets/images/svg/Me.png"

export default function Header({title}) {
    return (
        <header className={style.header}>
            <div className={style.content}>
                <div className={style.left}>
                    <h1 className={style.title}>{title}</h1>
                </div>
                <div className={style.right}>
                <div className={style.today}>
                <div>Friday, 30 October 2020</div>
                </div>
                <div className={style.icons}>
                    <img src={Alarm} alt=""/>
                    <img src={Todo} alt=""/>
                </div>
                <div className={style.personal}>
                <img className={style.pic} src={Me} width="44" height="44" alt=""/>
                <p className={style.name}>Coach <span>Bert</span></p>
                </div>
                </div>
            </div>
        </header>
    )
}
