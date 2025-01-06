import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertReviews = async (count = 10) => {
  try {
    // Get doctor and patient IDs to maintain relationships
    const doctorIds = await sql`SELECT doctor_id FROM doctor`;
    const patientIds = await sql`SELECT patient_id FROM patient`;

    if (!doctorIds.length || !patientIds.length) {
      console.error("No doctors or patients available to create reviews.");
      return await sql.end();
    }

    // Limit the number of reviews to the available doctor-patient combinations
    const maxReviews = Math.min(count, doctorIds.length * patientIds.length);

    const reviews = Array.from({ length: maxReviews }, () => {
      const doctorId = faker.helpers.arrayElement(doctorIds).doctor_id;
      const patientId = faker.helpers.arrayElement(patientIds).patient_id;
      const rating = faker.number.int({ min: 1, max: 5 }); // Random rating between 1 and 5
      const reviewText = faker.lorem.sentence(); // Random review text
      const createdAt = faker.date.recent({ days: 30 }); // Random date within the last 30 days

      return sql`
        INSERT INTO review (id, doctor_id, patient_id, rating, review_text, created_at)
        VALUES (${faker.string.uuid()}, ${doctorId}, ${patientId}, ${rating}, ${reviewText}, ${createdAt});
      `;
    });

    // Execute all insertions
    await Promise.all(reviews);

    console.log(`${maxReviews} fake reviews inserted successfully!`);
  } catch (error) {
    console.error("Error inserting reviews:", error);
  } finally {
    await sql.end();
  }
};

insertReviews();
