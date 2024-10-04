import express from "express";
import dotenv from "dotenv";

// Libs
import db from "./libs/db.js";
import { middlewares } from "./libs/middlewares.js";
import { passportAuth } from "./libs/auth.js";

// Models
import User from "./models/User.js";

// Routers
import { usersRouter } from "./routes/users.js";
import { tokenRouter } from "./routes/token.js";

// Controllers
import { UserControllers } from "./controllers/user.js";
import { TokenController } from "./controllers/token.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();
const authenticate = passportAuth(User).authenticate();
const { getUserById, createUser, deleteUser, updateUser } = UserControllers(User);
const { createToken } = TokenController(User);

middlewares(app, User);

// Routes
usersRouter({ app, authenticate, getUserById, createUser, deleteUser, updateUser });
tokenRouter({ app, createToken });

/**
 * Starts the Express server and connects to the SQL database.
 */
const startServer = async () => {
  if (process.env.NODE_ENV !== "test") {
    try {
      await db.sequelize.sync({ force: true });
      console.log("Connection has been established successfully.");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
};

startServer();
