import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
 mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      email
      username
    }
  }
}
`;

export const ADD_USER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      email
      username
    }
  }
}
`;

export const SAVE_BOOK = gql`
  mutation Mutation($input: BookReq!) {
  saveBook(input: $input) {
    _id
  }
}
`;

export const REMOVE_BOOK = gql`
  mutation Mutation($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
    bookCount
  }
}
`;
