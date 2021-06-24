import {useQuery} from "@apollo/client";
import {FETCH_ROOM} from "../graphql";


export default function useRoom (id, password) {
    const {loading, error, data} = useQuery(FETCH_ROOM,
        {
            variables: {
                id: id,
                password: password,
            }
        }
    );

    if (data) {
        const room = data["room"];
        return {loading, error, room};
    }

    return {loading, error, data};
}