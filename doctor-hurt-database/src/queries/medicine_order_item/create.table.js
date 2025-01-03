import sql from "../../libs/db.js";

export const createMedicineOrderItemTable = async () => {
  try {
    await sql`
      CREATE TABLE medicine_order_item (
        id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        medicine_id VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        CONSTRAINT chk_positive_quantity CHECK (quantity > 0)
      );
    `;

    console.log("Medicine order item table created successfully.");
  } catch (error) {
    console.error("Error creating medicine order item table:", error);
  }
};
