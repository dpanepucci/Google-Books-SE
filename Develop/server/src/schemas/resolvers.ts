import  { User }  from '../models/User.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: Array<{
    title: string;
    authors: string[];
    description: string;
    bookId: string;
    image?: string;
    link?: string;
  }>;
}

interface getSingleUserArg {
  userId: string;
}

interface createUser {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface login {
  email: string;
  password: string;
}

interface saveBook {
  userId: string;
  book: {
    title: string;
    authors: string[];
    description: string;
    bookId: string;
    image?: string;
    link?: string;
  };
}

interface deleteBook {
  userId: string;
  bookId: string;
}

const resolvers = {
  Query: {
    getSingleUser: async (_parent: unknown, { userId }: getSingleUserArg): Promise<User | null> => {
      // Retrieve a user by their ID
      return await User.findOne({ _id: userId });
    },
  },

  Mutation: {
    createUser: async (_parent: unknown, { input }: createUser): Promise<{ token: string; user: User }> => {
      // Create a new user with the provided input
      const user = await User.create({ ...input });
      // Sign a JWT token for the new user
      const token = signToken(user.username, user.email, user._id);
      // Return the token and the created user
      return { token, user };
    },

    saveBook: async (_parent: unknown, { userId, book }: saveBook): Promise<User | null> => {
      // Save a book to the user's savedBooks array
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: book } },
        { new: true }
      );

      if (!updatedUser) {
        throw new AuthenticationError('Unable to save book');
      }

      return updatedUser;
    },

    deleteBook: async (_parent: unknown, { userId, bookId }: deleteBook): Promise<User | null> => {
      // Remove a book from the user's savedBooks array
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new AuthenticationError('Unable to delete book');
      }

      return updatedUser;
    },

    login: async (_parent: unknown, { email, password }: login): Promise<{ token: string; user: User }> => {
      // Find a user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Sign a JWT token for the authenticated user
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
  },
};

export default resolvers;
