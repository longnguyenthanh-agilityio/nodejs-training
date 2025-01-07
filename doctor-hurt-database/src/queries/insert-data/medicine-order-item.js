import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertOrderItems = async (count = 10) => {
  try {
    const orderIds = await sql`SELECT id FROM medicine_order`;
    const medicineIds = await sql`SELECT id FROM medicine`;

    if (!orderIds.length || !medicineIds.length) {
      console.error("No existing orders or medicines available.");
      return await sql.end();
    }

    const promises = Array.from({ length: count }, async () => {
      const orderId = faker.helpers.arrayElement(orderIds).id;
      const medicineId = faker.helpers.arrayElement(medicineIds).id;

      const id = faker.string.uuid();
      const quantity = faker.number.int({ min: 1, max: 10 });

      return sql`
        INSERT INTO medicine_order_item (id, order_id, medicine_id, quantity)
        VALUES (${id}, ${orderId}, ${medicineId}, ${quantity});
      `;
    });

    await Promise.all(promises);
    console.log(`${count} order items inserted successfully!`);
  } catch (error) {
    console.error("Error inserting order items:", error);
  } finally {
    await sql.end();
  }
};

insertOrderItems();
