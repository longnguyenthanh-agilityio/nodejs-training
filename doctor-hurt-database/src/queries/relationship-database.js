import sql from "../libs/db.js";

export const createRelationships = async () => {
  try {
    // Relationship for user and patient
    await sql`
        ALTER TABLE IF EXISTS patient
        ADD CONSTRAINT fk_patient_user FOREIGN KEY (user_id)
        REFERENCES "user" (user_id)
        ON DELETE CASCADE;
      `;

    // Relationship for user and doctor
    await sql`
        ALTER TABLE IF EXISTS doctor
        ADD CONSTRAINT fk_doctor_user FOREIGN KEY (user_id)
        REFERENCES "user" (user_id)
        ON DELETE CASCADE;
      `;

    // Relationship for booking, doctor, and patient
    await sql`
        ALTER TABLE IF EXISTS booking
        ADD CONSTRAINT fk_booking_patient FOREIGN KEY (patient_id)
        REFERENCES patient (patient_id)
        ON DELETE CASCADE,
        ADD CONSTRAINT fk_booking_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctor (doctor_id)
        ON DELETE CASCADE;
      `;

    // Relationship for review and doctor, patient
    await sql`
        ALTER TABLE IF EXISTS review
        ADD CONSTRAINT fk_review_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctor (doctor_id)
        ON DELETE CASCADE,
        ADD CONSTRAINT fk_review_patient FOREIGN KEY (patient_id)
        REFERENCES patient (patient_id)
        ON DELETE CASCADE;
      `;

    // Relationship for favorite and doctor, patient
    await sql`
        ALTER TABLE IF EXISTS favorite
        ADD CONSTRAINT fk_favorite_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctor (doctor_id)
        ON DELETE CASCADE,
        ADD CONSTRAINT fk_favorite_patient FOREIGN KEY (patient_id)
        REFERENCES patient (patient_id)
        ON DELETE CASCADE
      `;

    // Relationship for notification and user
    await sql`
        ALTER TABLE IF EXISTS notification
        ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id)
        REFERENCES "user" (user_id)
        ON DELETE CASCADE;
      `;

    // Relationship for transaction and booking
    await sql`
        ALTER TABLE IF EXISTS transaction
        ADD CONSTRAINT fk_transaction_booking FOREIGN KEY (booking_id)
        REFERENCES booking (id)
        ON DELETE CASCADE;
      `;

    // Relationship for payment and transaction
    await sql`
        ALTER TABLE IF EXISTS payment
        ADD CONSTRAINT fk_payment_transaction FOREIGN KEY (transaction_id)
        REFERENCES transaction (id)
        ON DELETE CASCADE;
      `;

    // Relationship for medicine_order and booking
    await sql`
        ALTER TABLE IF EXISTS medicine_order
        ADD CONSTRAINT fk_medicine_order_booking FOREIGN KEY (booking_id)
        REFERENCES booking (id)
        ON DELETE CASCADE;
      `;

    // Relationship for medical_record and booking
    await sql`
        ALTER TABLE IF EXISTS medical_record
        ADD CONSTRAINT fk_medical_record_booking FOREIGN KEY (booking_id)
        REFERENCES booking (id)
        ON DELETE CASCADE;
      `;

    // Relationship for medicine_order_item and medicine_order, medicine
    await sql`
        ALTER TABLE IF EXISTS medicine_order_item
        ADD CONSTRAINT fk_order_item_order FOREIGN KEY (order_id)
        REFERENCES medicine_order (id)
        ON DELETE CASCADE,
        ADD CONSTRAINT fk_order_item_medicine FOREIGN KEY (medicine_id)
        REFERENCES medicine (id)
        ON DELETE CASCADE;
      `;

    console.log("Relationships created successfully.");
  } catch (error) {
    console.error("Error creating relationships:", error);
  } finally {
    await sql.end();
  }
};
