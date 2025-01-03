import sql from "../../libs/db.js";

export const createTransactionTable = async () => {
  try {
    await sql`
      CREATE TYPE transaction_status AS ENUM ('success', 'failed', 'pending');
    `;

    await sql`
      CREATE TABLE transaction (
        id VARCHAR(255) PRIMARY KEY,
        booking_id VARCHAR(255) NOT NULL UNIQUE,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status transaction_status NOT NULL
      );
    `;
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
