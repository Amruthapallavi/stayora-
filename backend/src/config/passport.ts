// src/config/passport.ts
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User, { IUser } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error("Email not provided by Google"));
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // Link Google ID if not already linked
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Create a new user if not found
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
          password: "",
          isVerified: true,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
