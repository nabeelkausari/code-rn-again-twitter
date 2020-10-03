import { gql } from 'react-apollo';

export default gql`
  {
    getTweets {
      _id
      text
      createdAt
      favoriteCount
      isFavorited
      user {
        username
        avatar
        lastName
        firstName
      }
    }
  }
`;