import sql from "../../libs/db.js";

export const createMedicineTable = async () => {
  try {
    await sql`
        CREATE TABLE medicine (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          manufacturer VARCHAR(255)
        );
      `;

    console.log("Medicine table created successfully.");
  } catch (error) {
    console.error("Error creating medicine table:", error);
  }
};
