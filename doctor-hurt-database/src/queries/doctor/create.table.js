import sql from "../../libs/db.js";

export const createDoctorTable = async () => {
  try {
    await sql`
      CREATE TABLE doctor (
        doctor_id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE,
        rating_point DECIMAL(3, 2),
        specialization VARCHAR(255) NOT NULL,
        experience_years INT NOT NULL,
        qualification VARCHAR(255) NOT NULL,
        price INT,
        booking_success INT,
        booking_cancel INT
      );
    `;
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
