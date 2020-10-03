import React from 'react';
import styled from 'styled-components/native';
import { graphql } from 'react-apollo';

import FeedCardHeader from './FeedCardHeader';
import FeedCardBottom from './FeedCardBottom';
import FAVORITE_TWEET_MUTATION from '../../graphql/mutations/favoriteTweet';

const Root = styled.View`
  min-height: 180;
  background-color: ${props => props.theme.WHITE};
  width: 100%;
  padding: 7px;
  shadow-color: ${props => props.theme.SECONDARY};
  shadow-offset: 0px 2px;
  shadow-radius: 2;
  shadow-opacity: 0.1;
  margin-vertical: 5;
`;

const CardContentContainer = styled.View`
  flex: 1;
  padding: 10px 20px 10px 0px;
`;

const CardContentText = styled.Text`
  font-size: 14;
  text-align: left;
  font-weight: 500;
  color: ${props => props.theme.SECONDARY}
`;

const FeedCard = ({ text, user, createdAt, favoriteCount, favorite, isFavorited }) => (
  <Root>
    <FeedCardHeader {...user} createdAt={createdAt} />
    <CardContentContainer>
      <CardContentText>
        {text}
      </CardContentText>
    </CardContentContainer>
    <FeedCardBottom
      favoriteCount={favoriteCount}
      onFavoritePress={favorite}
      isFavorited={isFavorited}
    />
  </Root>
);

export default graphql(FAVORITE_TWEET_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    favorite: () => mutate({
      variables: { _id: ownProps._id },
      optimisticResponse:  {
        __typename: 'mutation',
        favoriteTweet: {
          __typename: 'Tweet',
          _id: ownProps._id,
          favoriteCount: ownProps.isFavorited ? ownProps.favoriteCount - 1 : ownProps.favoriteCount + 1,
          isFavorited: !ownProps.isFavorited,
        }
      }
    })
  })
})(FeedCard);
