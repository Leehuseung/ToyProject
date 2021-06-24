import {useContext, useState} from "react";
import {useQuery} from "@apollo/client";
import {SIGN_IN} from "./graphql";
import {AuthContext} from "./AuthProvider";

export function useModal () {
    const [showModal, updateShowModal] = useState(false);
    const toggleModal = () => updateShowModal(state=>!state);

    return [showModal, toggleModal];
}

export function useSignIn(token) {
    const authContext = useContext(AuthContext)
    const {loading, error, data} = useQuery(SIGN_IN, {
        variables : {token : token},
        onCompleted : (data) => {
            authContext.loginComplete(data.user);
        },
        onError : () => {
            authContext.loginComplete(null);
        }
    });

    return {loading, error, data};
}