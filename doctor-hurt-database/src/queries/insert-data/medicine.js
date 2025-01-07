import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertMedicines = async (count = 10) => {
  try {
    const promises = Array.from({ length: count }, async () => {
      const id = faker.string.uuid();
      const name = faker.commerce.productName();
      const description = faker.lorem.paragraph();
      const manufacturer = faker.company.name();

      // Insert into medicine table
      return sql`
        INSERT INTO medicine (id, name, description, manufacturer)
        VALUES (${id}, ${name}, ${description}, ${manufacturer});
      `;
    });

    await Promise.all(promises);
    console.log(`${count} medicines inserted successfully!`);
  } catch (error) {
    console.error("Error inserting medicines:", error);
  } finally {
    await sql.end();
  }
};

insertMedicines();
