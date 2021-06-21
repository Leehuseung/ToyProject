import React, {useContext} from "react";
import loginImage from "../img/kakaoLogin.png";
import {makeStyles} from "@material-ui/core/styles";
import {AuthContext, AuthStatus} from "../AuthProvider";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    authButton: {
        height: 40,
        '&:hover': {
            cursor: 'pointer',
        }
    },
}));

export default function AuthButton() {
    const classes = useStyles();
    const authContext = useContext(AuthContext);
    const status = authContext.status;
    const login = authContext.signIn;
    const logout = authContext.signOut;

    if (status === AuthStatus.UNAUTHENTICATED || status === AuthStatus.GUEST)
        return (
            <div>
                <img className={classes.authButton}
                     src={loginImage}
                     alt="kakao login"
                     onClick={login}
                />
            </div>
        );
    else if (status === AuthStatus.LOADING)
        return (
            <div>Loading</div>
        )
    else
        return (
            <Button onClick={logout}
                    variant="contained"
                    color="inherit"
            >
                Log Out
            </Button>
        )
}