import Room from "./Room";
import {useState} from "react";
import {useEffect} from "react";

const getWrapperSize = () => {
    return (window.innerHeight-64)+'px'
}


export default function OmokMain(props){

    const refreshHeight = () => {
        setHeight(getWrapperSize());
    }

    let [height,setHeight] = useState(getWrapperSize());

    useEffect(() => {
        window.addEventListener('resize', refreshHeight);
        return () => { // cleanup
            window.removeEventListener('resize', refreshHeight);
        }
    }, []);


    return (
        <>
            <div style={{paddingTop:'64px',display:'grid',gridTemplateColumns: '2fr 1fr'}}
            >
                <div className='roomWrap' style={{maxHeight:height,overflowY:'auto', marginLeft: '30px'}}>
                    <Room/>
                    <Room/>
                    <Room/>
                    <Room/>
                    <Room/>
                    <Room/>
                    <Room/>
                </div>
                <div style={{backgroundColor:"skyblue",maxHeight:'600px',marginTop:'30px'}}>
                    <h2>채팅영역</h2>
                </div>
            </div>
        </>
    );
}