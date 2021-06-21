import {gql} from '@apollo/client';

export const FETCH_ROOMS = gql`
    query { 
      rooms {
        id
        title
        isAvailable
        hasPassword
      }
    }
`;


export const FETCH_ROOM = gql`
    query FetchRoom($id : ID!, $password: String, $userId: String){ 
      room(id : $id, password: $password, userId: $userId) {
        id
        title
        isAvailable
        hasPassword
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


export const CREATE_USER = gql`
    mutation CreateUser($token: ID, $sid: ID) { 
       createUser(token: $token, sid: $sid) {
         id
         name
      } 
    }
`;
