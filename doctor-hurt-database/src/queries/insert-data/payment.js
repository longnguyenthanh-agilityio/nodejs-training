import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertPayments = async (count = 10) => {
  try {
    // Fetch transaction IDs to maintain the relationship
    const existingTransactionIdSet = await sql`
        SELECT id FROM transaction LIMIT ${count}`;

    if (existingTransactionIdSet.length === 0) {
      console.error("No transactions available to create payments.");
      return await sql.end();
    }

    const paymentMethods = ["credit_card", "debit_card", "paypal", "bank_transfer"];
    const paymentStatus = ["pending", "completed", "failed", "refunded"];

    // Insert payments
    const promises = existingTransactionIdSet.map(({ id: transactionId }) => {
      const id = faker.string.uuid();
      const amount = faker.finance.amount(50, 550, 2);
      const payment_date = faker.date.future();
      const payment_method = faker.helpers.arrayElement(paymentMethods);
      const status = faker.helpers.arrayElement(paymentStatus);

      return sql`
        INSERT INTO payment (id, transaction_id, amount, payment_date, payment_method, status)
        VALUES (${id}, ${transactionId}, ${amount}, ${payment_date}, ${payment_method}, ${status});
      `;
    });

    await Promise.all(promises);

    console.log(`${existingTransactionIdSet.length || count} payments inserted successfully!`);
  } catch (error) {
    console.error("Error inserting payments:", error);
  } finally {
    await sql.end();
  }
};

insertPayments();
