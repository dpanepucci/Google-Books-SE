
// CHANGE FILE TO MATCH WHAT THE PROJECT NEEDS. USE CONTROLLER.TS FILE FOR REFERENCE 

import { Profile } from '../models/index.js'; // Will need to change import
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

  },

  Mutation: {

    },

    login: async (_parent: unknown, { email, password }: { email: string; password: string }): Promise<{ token: string; profile: Profile }> => {
      // Find a profile by email
      const profile = await Profile.findOne({ email });

      if (!profile) {
        // If profile with provided email doesn't exist, throw an authentication error
        throw AuthenticationError;
      }

      // Check if the provided password is correct
      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        // If password is incorrect, throw an authentication error
        throw new AuthenticationError('Not Authenticated');
      }

      // Sign a JWT token for the authenticated profile
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },
};

export default resolvers;
