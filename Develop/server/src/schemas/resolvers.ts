
// CHANGE FILE TO MATCH WHAT THE PROJECT NEEDS. USE CONTROLLER.TS FILE FOR REFERENCE 

import { createUser, deleteBook, getSingleUser, login, saveBook } from '../controllers/user-controller.js';
import { User } from '../models/User.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface getSingleUser {

}

interface createUser {

}

interface login {

}

interface saveBook {

}

interface deleteBook {

}

const resolvers = {
  Query: {
    getSingleUser

  },

  Mutation: {
    createUser,
    saveBook,
    deleteBook,


    login: async (_parent: unknown, { email, password }: { email: string; password: string }): Promise<{ token: string; profile: Profile }> => {
      // Find a profile by email
      const user = await User.findOne({ email });

      if (!user) {
        // If profile with provided email doesn't exist, throw an authentication error
        throw AuthenticationError;
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        // If password is incorrect, throw an authentication error
        throw new AuthenticationError('Not Authenticated');
      }

      // Sign a JWT token for the authenticated profile
      const token = signToken(user.name, user.email, user._id);
      return { token, profile: user };
    },
  },
};

export default resolvers;
