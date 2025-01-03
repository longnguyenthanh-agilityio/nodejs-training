import sql from "../../libs/db.js";

export const createMedicineOrderTable = async () => {
  try {
    await sql`
        CREATE TABLE medicine_order (
          id VARCHAR(255) PRIMARY KEY,
          booking_id VARCHAR(255) NOT NULL UNIQUE,
          prescription TEXT NOT NULL,
          order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

    console.log("Medicine order table created successfully.");
  } catch (error) {
    console.error("Error creating medicine order table:", error);
  }
};
