import Tweet from '../../models/Tweet';
import FavoriteTweet from '../../models/FavoriteTweet';
import { requireAuth } from '../../services/auth';
import { pubsub } from "../../config/pubsub";
const TWEET_ADDED = 'tweetAdded';
const TWEET_FAVORITED = 'tweetFavorited';

export default {
  getTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.findById(_id);
    } catch (err) {
      throw err;
    }
  },
  getTweets: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      const p1 = Tweet.find({}).sort({ createdAt: -1 });
      const p2 = FavoriteTweet.findOne({ userId: user._id });
      const [tweets, favorites] = await Promise.all([p1, p2]);

      return tweets.reduce((arr, tweet) => {
        const tw = tweet.toJSON();
        if (favorites.tweets.some(t => t.equals(tw._id))) {
          arr.push({
            ...tw,
            isFavorited: true
          })
        } else {
          arr.push({
            ...tw,
            isFavorited: false
          })
        }
        return arr;
      }, []);
    } catch (err) {
      throw err;
    }
  },
  getUserTweets: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.find({ user: user._id }).sort({ createdAt: -1 });
    } catch (err) {
      throw err;
    }
  },
  createTweet: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      const tweet = await Tweet.create({ ...args, user: user._id });

      pubsub.publish(TWEET_ADDED, { [TWEET_ADDED]: tweet });

      return tweet;
    } catch (err) {
      throw err;
    }
  },
  updateTweet: async (_, {_id, ...rest}, { user }) => {
    try {
      await requireAuth(user);
      const tweet = await Tweet.findOne({ _id, user: user._id });

      if (!tweet) throw new Error('Not found');

      Object.entries(rest).forEach(([key, value]) => {
        tweet[key] = value
      });

      return tweet.save();
    } catch (err) {
      throw err;
    }
  },
  deleteTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      const tweet = await Tweet.findOne({ _id, user: user._id });
      if (!tweet) throw new Error('Not found');
      await tweet.remove();
      return {
        message: 'Delete Success'
      }
    } catch (err) {
      throw err;
    }
  },
  favoriteTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      const favorites = await FavoriteTweet.findOne({ userId: user._id });
      const favoritedTweet = favorites.userFavoritedTweet(_id);
      pubsub.publish(TWEET_FAVORITED, { [TWEET_FAVORITED]: favoritedTweet });
      return favoritedTweet;

    } catch (err) {
      throw err;
    }
  },
  tweetAdded: {
    subscribe: () => pubsub.asyncIterator(TWEET_ADDED)
  },
  tweetFavorited: {
    subscribe: () => pubsub.asyncIterator(TWEET_FAVORITED)
  }
}