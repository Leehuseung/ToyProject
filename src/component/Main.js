import TodoWrap from "./TodoWrap";
import Header from "./Header";
import React from "react";

export default function Main(props) {
    return (
        <div id="main">
            <Header/>
            <TodoWrap/>
        </div>
        );
    }