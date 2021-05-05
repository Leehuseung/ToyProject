import './css/App.css';
import React from "react";
import Main from './component/Main';
import Sidebar from './component/Sidebar';


export default function App() {

    return (
        <div className="App">
            <Sidebar/>
            <Main/>
        </div>
    );

}