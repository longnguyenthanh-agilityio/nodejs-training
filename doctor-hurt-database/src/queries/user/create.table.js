import sql from "../../libs/db.js";

export const createUserTable = async () => {
  try {
    await sql`
     CREATE TYPE user_role AS ENUM ('patient', 'doctor');
   `;

    await sql`
    CREATE TABLE "user" (
      user_id VARCHAR(255) PRIMARY KEY UNIQUE,
      name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50),
      address TEXT,
      date_of_birth DATE,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role user_role NOT NULL
    );
  `;
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
