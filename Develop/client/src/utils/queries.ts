// Will hold the GET_ME, which will execute the 'me' query set up using the Apollo Server.

import { gql } from '@apollo/client'

export const GET_ME = gql`
  query Me {
  me {
    _id
    bookCount
    email
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
    username
  }
}
`;