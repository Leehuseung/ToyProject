import React from "react";
import loginImage from "../img/kakaoLogin.png";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    kakaoButton: {
        height: 40,
        '&:hover': {
            cursor: 'pointer',
        }
    },
}));

export default function KakaoLoginButton() {
    const classes = useStyles();
    const login = () => {
        window.Kakao.Auth.login({
            scope: 'account_email',
            success: function (authObj) {
                window.KaKao.API.request({
                    url: '/v2/user/me',
                    success: res => {
                        const token = authObj.access_token;
                        console.log(token);
                    }
                });
            },
            fail: function (err) {
                alert("로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.");
            },
        });
    }

    return (
      <div>
          <img className={classes.kakaoButton}
               style={{display:'none'}}
               src={loginImage}
               alt="kakao login"
               onClick={login}
          />
      </div>
    );

}