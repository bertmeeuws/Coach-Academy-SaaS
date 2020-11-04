import React from 'react'
import Dashboard from './coach/Dashboard'
import Sidebar from '../components/Sidebar/'

export default function Content() {
    return (
        <div className="content-grid">

          
          <Sidebar/>
          <Dashboard/>
        </div>
    )
}
