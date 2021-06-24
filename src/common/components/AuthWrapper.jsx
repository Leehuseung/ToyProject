import React, {useContext} from "react";
import {AuthContext, AuthStatus} from "../AuthProvider";
import {GuestLogInButton, KakaoLogInButton} from "./AuthButton";
import {makeStyles} from "@material-ui/core/styles";
import {AppLogin} from "./AppLogin";
import {Route, Switch} from "react-router-dom";
import {routes} from "../routes";

const useStyles = makeStyles((theme) => ({
    authButtons: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'calc(50vh)',
    }
}));

export const AuthWrapper = () => {
    const classes = useStyles()
    const status = useContext(AuthContext).status;

    if (status === AuthStatus.UNAUTHENTICATED) {
        return (
            <div className={classes.authButtons}>
                <KakaoLogInButton/>
                <GuestLogInButton/>
            </div>
        );
    }

    if (status === AuthStatus.PROCESSING) {
        return (
            <AppLogin/>
        );
    }

    if (status === AuthStatus.AUTHENTICATED) {
        return (
            <Switch>
                {routes.map((route, index) => (
                    <Route
                        key={route.path}
                        exact={route.exact}
                        path={route.path}
                        render={route.render}
                    />
                ))}
            </Switch>
        );
    }
}