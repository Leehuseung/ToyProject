import {gql} from '@apollo/client';


export const FETCH_ROOMS = gql`
    query FetchRooms { 
      rooms @rest(path: "/rooms",) {
        results {
            id,
            title,
            user,
            isAvailable,
            hasPassword,
        }
      }
    }
`;


export const FETCH_ROOM = gql`
    query FetchRoom { 
      currentRoom(id: $id) @rest(type: "Room", path: "/rooms/{args.id}",) {
            id,
            title,
            user,
            isAvailable,
            hasPassword,
      }
    }
`;

export const CREATE_ROOM = gql`
    mutation CreateRoom { 
        createRoom(input: $input) @rest(type: "Room", path: "/rooms/", method: "POST") { 
            id
        } 
    }
`;

export const UPDATE_ROOM = gql`
    mutation UpdateRoom { 
        updateRoom(input: $input) @rest(type: "Room", path: "/rooms/{args.input.id}", method: "POST") { 
            id,
            title,
            user,
            isAvailable,
            hasPassword,
        } 
    }
`;

export const DELETE_ROOM = gql`
    mutation DeleteRoom {
      deleteRoom (id: $id) @rest(type: "Room", path: "/rooms/{args.id}", method: "DELETE") {
        id
      }
    }
`;