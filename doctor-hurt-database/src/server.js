import { initializeDatabase } from "./queries/initialize-database.js";

// First: Initialize all database tables concurrently
initializeDatabase();
