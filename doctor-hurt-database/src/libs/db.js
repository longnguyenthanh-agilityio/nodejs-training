import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const sql = postgres({
  host: process.env.POSTGRES_HOST, // Postgres ip address[s] or domain name[s]
  port: process.env.POSTGRES_PORT, // Postgres server port[s]
  database: process.env.POSTGRES_DB, // Name of database to connect to
  username: process.env.POSTGRES_USER, // Username of database user
  password: process.env.POSTGRES_PASSWORD, // Password of database user
}); // will use psql environment variables

export default sql;
