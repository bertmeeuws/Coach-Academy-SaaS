import React from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'
import AddButton from '../../components/AddButton/AddButton'
import ClientItem from '../../components/ClientItem/ClientItem'


export default function Clients() {
    return (
        <section className="clients">
            <div className="clients-left">
            <div className="clients-header">
            <SearchBar/>
            <AddButton/>
            </div>
            <div className="clients-list">
                <div className="client-list-header smalltext">
                <p>CLIENT NAME</p>
                <p>STATUS</p>
                <p>ACTIONS</p>
                </div>
                <ClientItem />
                <ClientItem />
                <ClientItem />
                <ClientItem />
                <ClientItem />
                <ClientItem />
                <ClientItem />
            </div>
            </div>
            <div className="clients-right">
            
            </div>
        </section>
    )
}
