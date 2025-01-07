import { faker } from "@faker-js/faker";
import sql from "../../libs/db.js";

export const insertFavorites = async (count = 10) => {
  try {
    // Fetch valid doctor IDs
    const doctors = await sql`SELECT doctor_id FROM doctor`;
    const patients = await sql`SELECT patient_id FROM patient`;

    if (!doctors.length || !patients.length) {
      console.error("No doctors or patients available to create favorites.");
      return await sql.end();
    }

    const favoritesData = Array.from({ length: count }, () => {
      const doctor_id = faker.helpers.arrayElement(doctors).doctor_id;
      const patient_id = faker.helpers.arrayElement(patients).patient_id;

      return {
        id: faker.string.uuid(),
        doctor_id,
        patient_id,
      };
    });

    // Insert data into the favorite table
    await Promise.all(
      favoritesData.map(
        ({ id, doctor_id, patient_id }) =>
          sql`
          INSERT INTO favorite (id, doctor_id, patient_id)
          VALUES (${id}, ${doctor_id}, ${patient_id});
        `,
      ),
    );

    console.log(`${count} favorites inserted successfully!`);
  } catch (error) {
    console.error("Error inserting favorites:", error);
  } finally {
    await sql.end();
  }
};

insertFavorites();
