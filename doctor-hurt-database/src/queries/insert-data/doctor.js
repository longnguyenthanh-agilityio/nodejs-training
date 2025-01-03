import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

export const insertDoctors = async (count = 100) => {
  try {
    const doctorUsers = await sql`
      SELECT user_id FROM "user"
      WHERE role = 'doctor'
      LIMIT ${count}
    `;

    if (doctorUsers.length === 0) {
      console.log("No new doctor users to insert.");
      return;
    }

    // Step 2: Generate doctor-specific data
    const doctorData = doctorUsers.map((user) => {
      return {
        doctor_id: faker.string.uuid(),
        user_id: user.user_id,
        rating_point: parseFloat(
          faker.number.float({ min: 1, max: 5, precision: 0.01 }).toFixed(2),
        ),
        specialization: faker.word.noun(),
        experience_years: faker.number.int({ min: 1, max: 40 }),
        qualification: faker.word.adjective() + " degree",
        price: faker.number.int({ min: 50, max: 500 }),
        booking_success: faker.number.int({ min: 0, max: 100 }),
        booking_cancel: faker.number.int({ min: 0, max: 20 }),
      };
    });

    // Step 3: Insert into the doctor table
    const insertQueries = doctorData.map(
      (doctor) =>
        sql`
        INSERT INTO doctor (
          doctor_id,
          user_id,
          rating_point,
          specialization,
          experience_years,
          qualification,
          price,
          booking_success,
          booking_cancel
        ) VALUES (
          ${doctor.doctor_id},
          ${doctor.user_id},
          ${doctor.rating_point},
          ${doctor.specialization},
          ${doctor.experience_years},
          ${doctor.qualification},
          ${doctor.price},
          ${doctor.booking_success},
          ${doctor.booking_cancel}
        )
      `,
    );

    await Promise.all(insertQueries);

    console.log(`${doctorData.length} fake doctors inserted successfully!`);
  } catch (error) {
    console.error("Error inserting fake doctors:", error);
  } finally {
    await sql.end();
  }
};

// Execute the function
insertDoctors();
