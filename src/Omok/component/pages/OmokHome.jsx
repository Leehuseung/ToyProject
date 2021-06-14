import React from "react";
import {useGameUser} from "../../js/hooks";
import OmokMain from "./OmokMain";
import {Button, makeStyles} from "@material-ui/core";
import {fade} from "@material-ui/core/styles";


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
    const user = useGameUser();

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
                    onClick={()=>window.location.reload()}
                >
                    Try Again
                </Button>
            </div>
        );
    }

}

