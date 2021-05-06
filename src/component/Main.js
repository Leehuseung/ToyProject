import TodoLayout from "./TodoLayout";
import Header from "./Header";
import React from "react";
import Sidebar from "./Sidebar";

export default function Main(props) {
    return (
        <div id="main">
            <Sidebar/>
            <Header/>
            <TodoLayout/>
        </div>
    );
}