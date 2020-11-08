import React from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'
import AddButton from '../../components/AddButton/AddButton'
import ClientItem from '../../components/ClientItem/ClientItem'
import ClientOverview from '../../components/ClientOverview/ClientOverview'


export default function Clients() {
    return (
        <section className="clients">
            <h1 className="hidden">Clients</h1>
            <div className="clients-left">
            <div className="clients-header">
            <SearchBar/>
            <AddButton text="Add"/>
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
            <ClientOverview />
            </div>
        </section>
    )
}
