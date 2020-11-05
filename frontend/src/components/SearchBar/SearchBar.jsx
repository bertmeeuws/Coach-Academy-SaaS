import React from 'react'
import Search from '../../assets/images/svg/Search.svg'

export default function SearchBar() {
    return (
        <form className="clients-search rounded shadow">
            <img src={Search} alt=""/>
            <input type="text" className="search-input" placeholder="Search names of clients"/>
        </form>
    )
}
