import React, { Component } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, FlatList, AsyncStorage } from 'react-native';
import { graphql, compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';

import FeedCard from '../components/FeedCard/FeedCard';
import { getUserInfo } from "../actions/user";

import GET_TWEETS_QUERY from '../graphql/queries/getTweets';
import ME_QUERY from '../graphql/queries/me';
import TWEET_ADDED_SUBSCRIPTION from '../graphql/subscriptions/tweetAdded';
import TWEET_FAVORITED_SUBSCRIPTION from '../graphql/subscriptions/tweetFavorited';

const Root = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 5;
`;

class HomeScreen extends Component {

  componentWillMount() {
    if(!this.subscription) {
      const {subscribeToMore} = this.props.data;
      this.subscription = [
        subscribeToMore({
          document: TWEET_ADDED_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newTweet = subscriptionData.data.tweetAdded;

            if (!prev.getTweets.find(t => t._id === newTweet._id)) {
              return {
                ...prev,
                getTweets: [{ ...newTweet }, ...prev.getTweets]
              }
            }

            return prev;
          }
        }),
        subscribeToMore({
          document: TWEET_FAVORITED_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const { tweetFavorited } = subscriptionData.data;

            prev.getTweets = prev.getTweets.map((tweet) => {
              if(tweet._id === tweetFavorited._id) {
                return {
                  ...tweet,
                  ...tweetFavorited
                }
              } else {
                return tweet
              }
            })

            return prev;
          }
        })
      ]
    }
  }

  componentDidMount() {
    this._getUserInfo();
  }

  _getUserInfo = async () => {
    const { data: { me } } = await this.props.client.query({ query: ME_QUERY })
    this.props.getUserInfo(me);
  }

  _renderItem = ({ item }) => <FeedCard {...item} />

  render() {
    const { data } = this.props;
    if (data.loading) {
      return (
        <Root>
          <ActivityIndicator size="large"/>
        </Root>
      )
    }
    return (
      <Root>
        <FlatList
          contentContainerStyle={{ alignSelf: 'stretch' }}
          data={data.getTweets}
          keyExtractor={item => item._id}
          renderItem={this._renderItem}
        />
      </Root>
    );
  }
}

export default withApollo(compose(
  connect(null, { getUserInfo }),
  graphql(GET_TWEETS_QUERY)
)(HomeScreen));
