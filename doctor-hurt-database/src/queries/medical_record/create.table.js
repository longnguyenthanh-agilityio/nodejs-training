import sql from "../../libs/db.js";

export const createMedicalRecordTable = async () => {
  try {
    await sql`
      CREATE TYPE medical_record_type AS ENUM ('invoice', 'prescription', 'report');
    `;

    await sql`
        CREATE TABLE medical_record (
          id VARCHAR(255) PRIMARY KEY,
          booking_id VARCHAR(255) NOT NULL UNIQUE,
          type medical_record_type NOT NULL,
          image_path VARCHAR(255),
          created_at DATE DEFAULT CURRENT_DATE
        );
      `;

    console.log("Medical record table created successfully.");
  } catch (error) {
    console.error("Error creating medical record table:", error);
  }
};
