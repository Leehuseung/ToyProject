import {gql} from '@apollo/client';

export const FETCH_ROOMS = gql`
    query { 
      rooms {
        id
        title
        isAvailable
        hasPassword
        user {
            id
            name
        }
      }
    }
`;


export const FETCH_ROOM = gql`
    query FetchRoom($id : ID!){ 
      room(id : $id) {
        id
        title
        isAvailable
        hasPassword
        user {
            id
            name
        }
      }
    }
`;


export const CREATE_ROOM = gql`
    mutation CreateRoom($title: String!, $password: String, $user: UserInput) { 
       createRoom(title: $title, password: $password, user: $user) {
        id
      } 
    }
`;


export const DELETE_ROOM = gql`
    mutation DeleteRoom($id: ID!) {
      deleteRoom (id: $id) {
        id
      }
    }
`;