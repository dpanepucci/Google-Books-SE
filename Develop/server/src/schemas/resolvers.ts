import { User } from '../models/User.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface BookInput {
  title: string;
  authors: string[];
  description: string;
  bookId: string;
  image?: string;
  link?: string;
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: { user: { _id: string } }) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return await User.findById(context.user._id);
    },
  },

  Mutation: {
    addUser: async (_parent: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },


    login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },


    saveBook: async (_parent: unknown, { input }: { input: BookInput }, context: { user: { _id: string } }) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true }
      );

      if (!updatedUser) {
        throw new AuthenticationError('Unable to save book');
      }

      return updatedUser;
    },


    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: { user: { _id: string } }) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new AuthenticationError('Unable to remove book');
      }

      return updatedUser;
    },
  },
};

export default resolvers;
