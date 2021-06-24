import React, {useContext} from "react";
import {useSignIn} from "../hooks";
import {AuthContext} from "../AuthProvider";


export const AppLogin = () => {
    const token = useContext(AuthContext).kToken;
    const {loading, error, data} = useSignIn(token);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    if (data) return `Done!`;
}