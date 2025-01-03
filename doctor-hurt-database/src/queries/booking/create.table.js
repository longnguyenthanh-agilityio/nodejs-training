import sql from "../../libs/db.js";

export const createBookingTable = async () => {
  try {
    await sql`
     CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'canceled', 'completed');
   `;

    await sql`
        CREATE TABLE IF NOT EXISTS booking (
          id VARCHAR(255) PRIMARY KEY,
          patient_id VARCHAR(255) NOT NULL,
          doctor_id VARCHAR(255) NOT NULL,
          patient_name VARCHAR(255),
          contact_number VARCHAR(50),
          address TEXT,
          booking_date DATE,
          booking_time TIME,
          cancel_reason VARCHAR(255),
          cancel_at TIMESTAMP,
          status booking_status DEFAULT 'pending'
        );
      `;

    console.log("Booking table created successfully.");
  } catch (error) {
    console.error("Error creating booking table:", error);
  }
};
