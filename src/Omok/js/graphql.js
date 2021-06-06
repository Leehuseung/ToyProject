import {gql} from '@apollo/client';


// export const FETCH_ROOMS = gql`
//     query FetchRooms {
//       rooms @rest(path: "/rooms",) {
//         results {
//             id,
//             title,
//             user,
//             isAvailable,
//             hasPassword,
//         }
//       }
//     }
// `;

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



// export const FETCH_ROOM = gql`
//     query FetchRoom {
//       currentRoom(id: $id) @rest(type: "Room", path: "/rooms/{args.id}",) {
//             id,
//             title,
//             user,
//             isAvailable,
//             hasPassword,
//       }
//     }
// `;

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

// export const CREATE_ROOM = gql`
//     mutation CreateRoom {
//         createRoom(input: $input) @rest(type: "Room", path: "/rooms/", method: "POST") {
//             id
//         }
//     }
// `;

export const CREATE_ROOM = gql`
    mutation CreateRoom($title: String!, $password: String, $user: User) { 
       createRoom(title: $title, password: $password, user: $user) {
        id
      } 
    }
`;


// export const DELETE_ROOM = gql`
//     mutation DeleteRoom {
//       deleteRoom (id: $id) @rest(type: "Room", path: "/rooms/{args.id}", method: "DELETE") {
//         id
//       }
//     }
// `;

export const DELETE_ROOM = gql`
    mutation DeleteRoom($id: ID!) {
      deleteRoom (id: $id) {
        id
      }
    }
`;