import { gql } from 'react-apollo';

export default gql`
  mutation favoriteTweet($_id: ID!) {
      favoriteTweet(_id: $_id) {
          favoriteCount
          isFavorited
          _id
      }
  }
`;