import dotenv from "dotenv";

dotenv.config();

export const config = {
  database: "dragon-ball",
  username: "",
  password: "",
  params: {
    dialect: "sqlite",
    storage: "dragon-ball.sqlite",
    define: {
      underscored: true,
    },
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: { session: false },
};
