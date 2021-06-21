import React, {useContext} from "react";
import OmokMain from "./OmokMain";
import {Button, makeStyles} from "@material-ui/core";
import {AuthContext} from "../../../common/AuthProvider";

export const UserContext = React.createContext(null);

const useStyles = makeStyles((theme) => ({
    home: {
        display: "flex",
        flexDirection: "row-reverse",
        marginBottom: '10px',
    },
    button: {
        marginLeft: 'auto',
        marginRight : 'auto',
        marginTop : 'calc(100vh/2)',
        padding: '10px'
    }
}));

export function OmokHome() {
    const classes = useStyles();
    const user = useContext(AuthContext).user;
    const guestLogin = useContext(AuthContext).signInAsGuest;

    if(user){
        return (
            <UserContext.Provider value = {user}>
                <OmokMain/>
            </UserContext.Provider>
        );
    } else {
        //use button to call retry method to get user
        return (
            <div className={classes.home}>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="inherit"
                    onClick={()=>guestLogin()}
                >
                    Enter As Guest
                </Button>
            </div>
        );
    }

}

