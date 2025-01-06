import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertTransactions = async (count = 10) => {
  try {
    // Fetch booking IDs to maintain the relationship
    const bookingIds = await sql`SELECT id FROM booking LIMIT ${count}`;

    if (bookingIds.length === 0) {
      console.error("No bookings available to create transactions.");
      return await sql.end();
    }

    const statuses = ["success", "failed", "pending"];

    // Insert transactions
    const promises = bookingIds.map(({ id: bookingId }) => {
      const transactionId = faker.string.uuid();
      const transactionDate = faker.date.future();
      const status = faker.helpers.arrayElement(statuses);

      return sql`
        INSERT INTO transaction (id, booking_id, transaction_date, status)
        VALUES (${transactionId}, ${bookingId}, ${transactionDate}, ${status});
      `;
    });

    await Promise.all(promises);

    console.log(`${count} transactions inserted successfully!`);
  } catch (error) {
    console.error("Error inserting transactions:", error);
  } finally {
    await sql.end();
  }
};

insertTransactions();
