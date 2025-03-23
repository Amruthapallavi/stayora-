import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import User, { IUser } from "../models/user.model";
import { CallbackError } from "mongoose";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "",
      scope: ["profile", "email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: IUser | false) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Email not provided by Google"), false);
        }

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // If user is not found, return an error to redirect to signup
        return done(null, false);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize User (for session)
passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

// Deserialize User (for session)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user as IUser);
  } catch (error) {
    done(error as CallbackError);
  }
});

export default passport;
