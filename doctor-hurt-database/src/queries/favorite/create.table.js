import sql from "../../libs/db.js";

export const createFavoriteTable = async () => {
  try {
    await sql`
        CREATE TABLE favorite (
          id VARCHAR(255) PRIMARY KEY,
          doctor_id VARCHAR(255) NOT NULL,
          patient_id VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

    console.log("Favorite table created successfully.");
  } catch (error) {
    console.error("Error creating favorite table:", error);
  }
};
