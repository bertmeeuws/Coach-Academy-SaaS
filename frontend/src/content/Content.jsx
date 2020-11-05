import React from 'react'
import Dashboard from './coach/Dashboard'
import Sidebar from '../components/Sidebar/'
import style from "./Content.module.css"
import Header from "../components/Header/"

export default function Content() {
    return (
        <div className="content-grid">
          <Sidebar/>
          <div className={style.grid}>
          <Header title="Client"/>
          <Dashboard/>
          </div>
          
        </div>
    )
}
