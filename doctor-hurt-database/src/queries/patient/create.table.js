import sql from "../../libs/db.js";

export const createPatientTable = async () => {
  try {
    await sql`
      CREATE TABLE patient (
        patient_id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE
      );
    `;
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
