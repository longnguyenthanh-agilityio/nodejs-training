import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

export const middlewares = (app) => {
  app.set("port", PORT);
  app.use(bodyParser.json());
  // TODO: Will update more feature in future
};
