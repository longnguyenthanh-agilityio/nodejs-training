import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertMedicalRecords = async (count = 5) => {
  try {
    const bookingIds = await sql`SELECT id FROM booking LIMIT ${count}`;

    if (bookingIds.length === 0) {
      console.error("No bookings found for creating medical records.");
      return await sql.end();
    }

    const promises = bookingIds.map(({ id: bookingId }) => {
      const type = faker.helpers.arrayElement(["invoice", "prescription", "report"]);
      const imagePath = faker.image.url();
      const createdAt = faker.date.past();

      return sql`
        INSERT INTO medical_record (id, booking_id, type, image_path, created_at)
        VALUES (${faker.string.uuid()}, ${bookingId}, ${type}, ${imagePath}, ${createdAt})
      `;
    });

    await Promise.all(promises);

    console.log(`${count} medical records inserted successfully!`);
  } catch (error) {
    console.error("Error inserting medical records:", error);
  } finally {
    await sql.end();
  }
};

insertMedicalRecords();
