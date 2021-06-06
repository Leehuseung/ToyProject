import {gql} from '@apollo/client';


export const FETCH_TODOS = gql`
    query { 
      todos {
        id
        text
        isCompleted
      }
    }
`;

export const ADD_TODO = gql`
    mutation AddTodos($text: String!, $isCompleted: Boolean) {
      createTodo(text: $text, isCompleted: $isCompleted) {
        id
        text
        isCompleted
      }
    }
`;


export const UPDATE_TODO = gql`
    mutation UpdateTodo($id: ID!, $text: String!, $isCompleted: Boolean) {
      updateTodo(id: $id, text: $text, isCompleted: $isCompleted) {
        id
        text
        isCompleted
      }
    }
`;

export const DELETE_TODO = gql`
    mutation DeleteTodo($id: ID!) {
      deleteTodo(id: $id) {
        id
      }
    }
`;