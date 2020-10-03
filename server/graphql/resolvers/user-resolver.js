import User from '../../models/User';
import FavoriteTweet from '../../models/FavoriteTweet';
import { requireAuth } from '../../services/auth';

export default {
  signup: async (_, { fullName, ...rest }) => {
    try {
      const [firstName, ...lastName] = fullName.split(' ');
      const user = await User.create({ firstName, lastName, ...rest })
      await FavoriteTweet.create({ userId: user._id });

      return {
        token: user.createToken()
      }
    } catch (err) {
      throw err;
    }
  },
  login: async (_, { email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not exist!');
      }
      if (!user.authenticateUser(password)) {
        throw new Error('Password not match')
      }
      return {
        token: user.createToken()
      }
    } catch (err) {
      throw err;
    }
  },
  me: async (_, args, { user }) => {
    try {
      return await requireAuth(user);
    } catch (err) {
      throw err;
    }
  }
}