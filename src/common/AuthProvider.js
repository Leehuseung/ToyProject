import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {CREATE_USER} from "../Omok/js/graphql";


export const AuthContext = React.createContext(null);

export const AuthStatus = {
    LOADING: 'loading',
    UNAUTHENTICATED: 'unauthenticated',
    GUEST: 'guest',
    AUTHENTICATED: 'authenticated'
}

export const AuthProvider = ({children}) => {
    const [status, setStatus] = useState(AuthStatus.UNAUTHENTICATED)
    const [user, setUser] = useState(null)

    const Kakao = window.Kakao;
    const [create] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            let user = data.createUser;
            window.sessionStorage.setItem('sid', user.id);
            setUser({id: user.id, name: user.name});
            setStatus(AuthStatus.AUTHENTICATED)
            // if(user.isGuest){
            //     setStatus(AuthStatus.GUEST)
            // } else {
            //     setStatus(AuthStatus.AUTHENTICATED)
            // }
        },
    });

    const signIn = () => {
        setStatus(AuthStatus.LOADING);

        if(Kakao.Auth.getAccessToken()){
            create({
                variables: {
                    token: Kakao.Auth.getAccessToken()
                }
            }).catch(error => console.log('GQL ERROR', error));
        } else {
            Kakao.Auth.login({
                scope: 'account_email',
                success: function (authObj) {
                    Kakao.Auth.setAccessToken(authObj.access_token);
                    create({
                        variables: {
                            token: authObj.access_token
                        }
                    }).catch(error => console.log('GQL ERROR', error));
                },
                fail: function (err) {
                    setStatus(AuthStatus.UNAUTHENTICATED)
                    alert("로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.");
                },
            });
        }
    }

    const signInAsGuest = () => {
        create({
            variables: {
                id: window.sessionStorage.getItem('sid') ?? ''
            }
        }).catch(error => {
            setStatus(AuthStatus.UNAUTHENTICATED);
            console.log('GQL ERROR', error);
        });
    }

    const signOut = () => {
        if (!Kakao.Auth.getAccessToken()) {
            alert('Not logged in.');
            return;
        }
        Kakao.Auth.logout(function () {
            console.log(Kakao.Auth.getAccessToken());
            setStatus(AuthStatus.UNAUTHENTICATED);
        });
    }

    return (
        <AuthContext.Provider
            value={{status, user, signIn, signInAsGuest, signOut}}
        >
            {children}
        </AuthContext.Provider>
    )
}