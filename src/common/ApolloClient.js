import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri : '/graphql/',
    //uri: `${window.location.protocol}//49.247.146.76:8000/graphql/`,
})

const authLink = setContext((_, { headers }) => {
    const token = window.sessionStorage.getItem('_ttk_');
    return {
        headers : {
            ...headers,
            authorization: token ?? "",
        }
    }
})

export const client = new ApolloClient({
        link : authLink.concat(httpLink),
        cache: new InMemoryCache(),
    }
);