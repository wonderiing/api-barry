import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // Importa correctamente la estrategia
import dotenv from "dotenv";
import User from "../../models/usuario.js";

dotenv.config();

console.log("Google Strategy Initialized");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Strategy Callback Triggered"); // Add this for debugging
      try {
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
        };
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
