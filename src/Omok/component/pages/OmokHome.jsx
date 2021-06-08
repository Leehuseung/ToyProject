import React from "react";
import {useGameUser} from "../../js/hooks";
import OmokMain from "./OmokMain";


export const UserContext = React.createContext(null);

export function OmokHome() {
    const [user, retry] = useGameUser();

    if(user){
        return (
            <UserContext.Provider value = {user}>
                <OmokMain/>
            </UserContext.Provider>
        );
    } else {
        //use button to call retry method to get user
        return (
            <div>
                Enter as Guest
            </div>
        );
    }

}

