import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Email not provided"), false);

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email,
            googleId: profile.id,
            isVerified: true,
          });
          await user.save();
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user as IUser);
  } catch (error) {
    done(error);
  }
});

export default passport;