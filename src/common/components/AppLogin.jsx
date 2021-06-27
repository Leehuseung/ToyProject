import React, {useContext} from "react";
import {useSignIn} from "../hooks";
import {AuthContext} from "../AuthProvider";


export const AppLogin = () => {
    const accessToken = useContext(AuthContext).kToken;
    const {loading, error, data} = useSignIn(accessToken);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    if (data) return `Done!`;
}