import {useQuery} from "@apollo/client";
import {FETCH_ROOM} from "../graphql";
import {useContext} from "react";
import {UserContext} from "../../component/pages/OmokHome";


export default function useRoom (id, password) {
    const user = useContext(UserContext);
    const {loading, error, data} = useQuery(FETCH_ROOM,
        {
            variables: {
                id: id,
                password: password,
                userId: user.id
            }
        }
    );

    if (data) {
        const room = data["room"];
        return {loading, error, room};
    }

    return {loading, error, data};
}