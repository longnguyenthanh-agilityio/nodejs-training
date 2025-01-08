import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertNotifications = async (count = 10) => {
  try {
    const userIds = await sql`SELECT user_id FROM "user"`;

    if (userIds.length === 0) {
      console.error("No users available to create notifications.");
      return await sql.end();
    }

    const promises = Array.from({ length: count }, async () => {
      const id = faker.string.uuid();
      const user_id = faker.helpers.arrayElement(userIds).user_id;
      const title = faker.lorem.sentence(5);
      const message = faker.lorem.paragraph();
      const type = faker.helpers.arrayElement(["appointment", "payment", "review", "general"]);
      const status = faker.helpers.arrayElement(["unread", "read"]);

      return sql`
        INSERT INTO notification (id, user_id, title, message, type, status)
        VALUES (${id}, ${user_id}, ${title}, ${message}, ${type}, ${status});
      `;
    });

    await Promise.all(promises);

    console.log(`${count} notifications inserted successfully!`);
  } catch (error) {
    console.error("Error inserting notifications:", error);
  } finally {
    await sql.end();
  }
};

insertNotifications();
