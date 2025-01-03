import sql from "../../libs/db.js";

export const createReviewTable = async () => {
  try {
    await sql`
      CREATE TABLE review (
        id VARCHAR(255) PRIMARY KEY,
        doctor_id VARCHAR(255) NOT NULL,
        patient_id VARCHAR(255) NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
