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
    query FetchRoom($id : ID!, $password: String){ 
      room(id : $id, password: $password) {
        id
        title
        isAvailable
        hasPassword
      }
    }
`;


export const CREATE_ROOM = gql`
    mutation CreateRoom($title: String!, $password: String) { 
       createRoom(title: $title, password: $password) {
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
