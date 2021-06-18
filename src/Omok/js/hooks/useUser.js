import {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {CREATE_USER} from "../graphql";


export default function useUser() {
    const [user, setUser] = useState(null);

    const [create] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            let user = data.createUser;
            window.sessionStorage.setItem('sid', user.id);
            window.sessionStorage.setItem('name', user.name);
            setUser({id: user.id, name: user.name});
        },
    });

    useEffect(() => {
        create({
            variables: {
                id: window.sessionStorage.getItem('sid') ?? ''
            }
        }).catch(error => console.log('GQL ERROR', error));
    }, [create]);

    return user;
}

