// users.js
import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertUsers = async (count = 990) => {
  try {
    const promises = Array.from({ length: count }, async () => {
      const user_id = faker.string.uuid();
      const name = faker.person.fullName();
      const phone_number = faker.phone.number("##########");
      const address = faker.location.streetAddress();
      const date_of_birth = faker.date.birthdate({ min: 18, max: 65, mode: "age" });
      const email = faker.internet.email();
      const password = faker.internet.password();
      const role = faker.helpers.arrayElement(["customer", "doctor"]);

      return sql`
          INSERT INTO "user" (user_id, name, phone_number, address, date_of_birth, email, password, role)
          VALUES (${user_id}, ${name}, ${phone_number}, ${address}, ${date_of_birth}, ${email}, ${password}, ${role});
        `;
    });

    await Promise.all(promises);

    console.log(`${count} fake users inserted successfully!`);
  } catch (error) {
    console.error("Error inserting fake data:", error);
  } finally {
    await sql.end();
  }
};

insertUsers();
