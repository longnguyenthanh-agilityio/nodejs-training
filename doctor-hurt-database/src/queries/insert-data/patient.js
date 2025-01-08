import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

export const insertPatients = async (count = 10) => {
  try {
    const patientUsers = await sql`
      SELECT user_id FROM "user"
      WHERE role = 'patient' AND user_id NOT IN ( SELECT user_id FROM patient)
      LIMIT ${count}
    `;

    if (patientUsers.length === 0) {
      console.log("No new patient users to insert.");
      return await sql.end();
    }

    const patientData = patientUsers.map((user) => {
      return {
        patient_id: faker.string.uuid(),
        user_id: user.user_id,
      };
    });

    const insertQueries = patientData.map(
      (patient) =>
        sql`
        INSERT INTO patient (patient_id, user_id) VALUES (${patient.patient_id}, ${patient.user_id});`,
    );

    await Promise.all(insertQueries);

    console.log(`${patientData.length || count} fake patients inserted successfully!`);
  } catch (error) {
    console.error("Error inserting fake patients:", error);
  } finally {
    await sql.end();
  }
};

// Execute the function
insertPatients();
