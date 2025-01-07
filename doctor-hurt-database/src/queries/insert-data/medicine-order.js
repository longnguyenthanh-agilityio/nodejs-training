import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertMedicineOrders = async (count = 5) => {
  try {
    // Get existing booking IDs from the booking table to ensure relationships
    const bookingIds = await sql`SELECT id FROM booking`;

    if (bookingIds.length === 0) {
      console.error("No bookings available to create medicine orders.");
      return await sql.end();
    }

    const promises = bookingIds.map(async (booking) => {
      const orderId = faker.string.uuid();
      const prescription = faker.lorem.sentence();
      const orderDate = faker.date.future();

      return sql`
        INSERT INTO medicine_order (id, booking_id, prescription, order_date)
        VALUES (${orderId}, ${booking.id}, ${prescription}, ${orderDate});
      `;
    });

    await Promise.all(promises);
    console.log(`${count} medicine orders inserted successfully!`);
  } catch (error) {
    console.error("Error inserting medicine orders:", error);
  } finally {
    await sql.end();
  }
};

insertMedicineOrders();
