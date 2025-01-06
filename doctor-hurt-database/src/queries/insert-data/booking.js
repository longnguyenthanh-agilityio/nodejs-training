import sql from "../../libs/db.js";
import { faker } from "@faker-js/faker";

const insertBookings = async (count = 10) => {
  try {
    // Fetch valid doctor IDs
    const doctors = await sql`SELECT doctor_id FROM doctor`;
    const doctorIds = doctors.map((d) => d.doctor_id);

    // Fetch valid patient IDs
    const patients = await sql`SELECT patient_id FROM patient`;
    const patientIds = patients.map((p) => p.patient_id);

    if (!doctorIds.length || !patientIds.length) {
      console.log("No valid doctor or patient records found.");
      return await sql.end();
    }

    // Generate booking data
    const bookings = Array.from({ length: count }, () => {
      const patientId = faker.helpers.arrayElement(patientIds);
      const doctorId = faker.helpers.arrayElement(doctorIds);
      return {
        id: faker.string.uuid(),
        patient_id: patientId,
        doctor_id: doctorId,
        patient_name: faker.person.fullName(),
        contact_number: faker.phone.number("##########"),
        address: faker.location.streetAddress(),
        booking_date: faker.date.future({ years: 1 }),
        booking_time: faker.date.between({
          from: new Date("2025-01-01T09:00:00"),
          to: new Date("2025-01-01T18:00:00"),
        }),
        cancel_reason: null,
        cancel_at: null,
        status: faker.helpers.arrayElement(["pending", "confirmed", "canceled", "completed"]),
      };
    });

    // Insert bookings into the database
    await Promise.all(
      bookings.map(
        (b) =>
          sql`
          INSERT INTO booking 
          (id, patient_id, doctor_id, patient_name, contact_number, address, booking_date, booking_time, cancel_reason, cancel_at, status) 
          VALUES (
            ${b.id}, ${b.patient_id}, ${b.doctor_id}, ${b.patient_name}, ${b.contact_number}, 
            ${b.address}, ${b.booking_date}, ${b.booking_time}, ${b.cancel_reason}, ${b.cancel_at}, ${b.status}
          )
        `,
      ),
    );

    console.log(`${count} bookings inserted successfully!`);
  } catch (error) {
    console.error("Error inserting booking data:", error);
  } finally {
    await sql.end();
  }
};

insertBookings();
