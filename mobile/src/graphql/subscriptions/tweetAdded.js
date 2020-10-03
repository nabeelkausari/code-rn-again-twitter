import { gql } from 'react-apollo';

export default gql`
  subscription {
      tweetAdded {
          text
          _id
          createdAt
          favoriteCount
          isFavorited
          user {
              username
              avatar
              firstName
              lastName
          }
      }
  }
`;