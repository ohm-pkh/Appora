import { useState,useEffect } from "react";
import searchSvg from '../assets/searchSvg.svg'

export default function SearchBar({ onSearch,onChange }) {
    const [q, setQ] = useState("");

    const doSearch = (e) => {
        e.preventDefault();
        onSearch(q);
    };

    useEffect(()=>{
        onChange(q);
    },[onChange,q])

    return (
        <form onSubmit={doSearch} className="searchBar">
            <div>
                <button className="searchButton" type="submit"><img src={searchSvg} alt="search" /></button>
                <input className="searchBox" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
        </form>
    );
}
