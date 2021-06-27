import {gql} from '@apollo/client';

export const SIGN_IN = gql`
    query ($accessToken: String) { 
       user (accessToken:$accessToken){
         id
         name
         token
      } 
    }
`;

