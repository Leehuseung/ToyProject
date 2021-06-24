import React, {useState} from "react";

export const AuthContext = React.createContext(null);

export const AuthStatus = {
    UNAUTHENTICATED: 'unauthenticated',
    PROCESSING : 'processing',
    AUTHENTICATED: 'authenticated',
}

export const AuthProvider = ({children}) => {
    const hasToken = () =>
        window.Kakao.Auth.getAccessToken()
        || window.sessionStorage.getItem('_ttk_')
    const getStatus = () => hasToken() && user
        ? AuthStatus.AUTHENTICATED
        : hasToken() ? AuthStatus.PROCESSING : AuthStatus.UNAUTHENTICATED

    const [user, setUser] = useState(null);

    //for automatic login use getStatus() to validate initial state
    const [status, setStatus] = useState(getStatus())

    const [kToken, setToken] = useState(window.Kakao.Auth.getAccessToken());

    const signIn = (kakaoToken) => {
        setToken(kakaoToken);
        setStatus(AuthStatus.PROCESSING);
    }

    const loginComplete = (user) => {
        console.log('login complete!!', user)
        if(user){
            window.sessionStorage.setItem('_ttk_', user.token);
            setUser(user)
            setStatus(AuthStatus.AUTHENTICATED);
        } else {
            setUser(user)
            setStatus(AuthStatus.UNAUTHENTICATED);
        }
    }

    const signOut = () => {
        window.sessionStorage.removeItem('_ttk_');
        setUser(null);
        setStatus(AuthStatus.UNAUTHENTICATED);
    }

    return (
        <AuthContext.Provider
            value={{status, user, signIn, signOut, loginComplete, kToken}}
        >
            {children}
        </AuthContext.Provider>
    )
}