import logo from './logo.svg';
import './App.css';
import {useEffect} from "react";
import React, {useState} from "react";

function App() {

    const [testList, setList] = useState([]);

    let dataList;

    useEffect(() => {
        fetch('http://localhost:8080/select')
            .then(res => res.json())
            .catch(reject => console.log('Fetch Error: ', reject))
            .then(
                (result) => {
                    console.log(result);
                    if(result){
                        setList(result);
                    }
                }
            );
    });



    return (
        <div className="App">
            <header className="App-header">
                <a>select * from test</a>
                <a>
                    {
                        testList.map(test => (
                            <a>{test.test},</a>
                        ))
                    }
                </a>
            </header>
        </div>
    );
}

export default App;
