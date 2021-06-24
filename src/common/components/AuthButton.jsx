import React, {useContext} from "react";
import loginImage from "../img/kakaoLogin.png";
import {makeStyles} from "@material-ui/core/styles";
import {AuthContext} from "../AuthProvider";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    authButton: {
        height: 40,
        marginLeft: 20,
        '&:hover': {
            cursor: 'pointer',
        }
    },
}));

export const GuestLogInButton = () => {
    const classes = useStyles();
    const authContext = useContext(AuthContext);

    return (
        <Button
            className={classes.authButton}
            variant="contained"
            color="inherit"
            onClick={() => authContext.signIn(null)}
        >
            Enter As Guest
        </Button>
    );
}

export const KakaoLogInButton = () => {
    const classes = useStyles();
    const authContext = useContext(AuthContext);
    const getKToken = () => {
        window.Kakao.Auth.login({
            scope: 'account_email',
            success: function (authObj) {
                window.Kakao.Auth.setAccessToken(authObj.access_token);
                authContext.signIn(authObj.access_token);
            },
            fail: function (err) {
                alert("로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.");
            },
        });
    }

    return (
        <div>
            <img className={classes.authButton}
                 src={loginImage}
                 alt="kakao login"
                 onClick={getKToken}
            />
        </div>
    );
}

export const LogOutButton = () => {
    const classes = useStyles();
    const authContext = useContext(AuthContext);
    const logout = () => {
        if (window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout();
        }
        authContext.signOut();
    }

    return (
        <Button
            className={classes.authButton}
            onClick={logout}
            variant="contained"
            color="inherit"
        >
            Log Out
        </Button>
    )
}