import { createBookingTable } from "./booking/create.table.js";
import { createDoctorTable } from "./doctor/create.table.js";
import { createFavoriteTable } from "./favorite/create.table.js";
import { createMedicalRecordTable } from "./medical_record/create.table.js";
import { createMedicineTable } from "./medicine/create.table.js";
import { createMedicineOrderTable } from "./medicine_order/create.table.js";
import { createMedicineOrderItemTable } from "./medicine_order_item/create.table.js";
import { createNotificationTable } from "./notification/create.table.js";
import { createPatientTable } from "./patient/create.table.js";
import { createPaymentTable } from "./payment/create.table.js";
import { createReviewTable } from "./review/create.table.js";
import { createTransactionTable } from "./transaction/create.table.js";
import { createUserTable } from "./user/create.table.js";

// relationship
import { createRelationships } from "./relationship-database.js";

export const initializeDatabase = async () => {
  try {
    await Promise.all([
      createUserTable(),
      createPatientTable(),
      createDoctorTable(),
      createBookingTable(),
      createReviewTable(),
      createFavoriteTable(),
      createNotificationTable(),
      createTransactionTable(),
      createPaymentTable(),
      createMedicineOrderTable(),
      createMedicalRecordTable(),
      createMedicineTable(),
      createMedicineOrderItemTable(),
    ]);

    await createRelationships();

    console.log("Database initialize successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
