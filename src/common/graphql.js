import {gql} from '@apollo/client';

export const SIGN_IN = gql`
    query ($token: String) { 
       user (token:$token){
         id
         name
         token
      } 
    }
`;

