import bodyParser from "body-parser";
import dotenv from "dotenv";
import { passportAuth } from "../libs/auth.js";

dotenv.config();

const PORT = process.env.PORT;

export const middlewares = (app, User) => {
  app.set("port", PORT);
  app.use(bodyParser.json());
  app.use(passportAuth(User).initialize());
  app.use((req, res, next) => {
    delete req.body.id;
    next();
  });
};
