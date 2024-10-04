import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { config } from "./config.js";

export const passportAuth = (UserModel) => {
  const params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  // Define the JWT strategy
  const strategy = new Strategy(params, async (jwtPayload, done) => {
    try {
      // Find the user by ID from the JWT payload
      const user = await UserModel.findOne({ where: { id: jwtPayload.id } });

      // If user exists, call done with the object include id and email
      if (user) {
        return done(null, {
          id: user.id,
          email: user.email,
        });
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(strategy);

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate("jwt", config.jwtSession),
  };
};
