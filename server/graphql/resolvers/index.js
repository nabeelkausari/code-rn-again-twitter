import GraphQLDate from 'graphql-date';

import User from '../../models/User';
import TweetResolver from './tweet-resolver';
import UserResolver from './user-resolver';

export default {
  Date: GraphQLDate,
  Tweet: {
    user: ({ user }) => User.findById(user)
  },
  Query: {
    getTweet: TweetResolver.getTweet,
    getTweets: TweetResolver.getTweets,
    getUserTweets: TweetResolver.getUserTweets,
    me: UserResolver.me
  },
  Mutation: {
    createTweet: TweetResolver.createTweet,
    updateTweet: TweetResolver.updateTweet,
    deleteTweet: TweetResolver.deleteTweet,
    favoriteTweet: TweetResolver.favoriteTweet,
    signup: UserResolver.signup,
    login: UserResolver.login
  },
  Subscription: {
    tweetAdded: TweetResolver.tweetAdded,
    tweetFavorited: TweetResolver.tweetFavorited,
  }
}