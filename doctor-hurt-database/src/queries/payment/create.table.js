import sql from "../../libs/db.js";

export const createPaymentTable = async () => {
  try {
    await sql`
      CREATE TYPE payment_method_type AS ENUM ('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash');
    `;
    await sql`
      CREATE TYPE payment_status_type AS ENUM ('pending', 'completed', 'failed', 'refunded');
    `;

    await sql`
      CREATE TABLE payment (
        id VARCHAR(255) PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_method payment_method_type NOT NULL,
        status payment_status_type DEFAULT 'pending',
        transaction_id VARCHAR(255) NOT NULL UNIQUE,
        CONSTRAINT chk_positive_amount CHECK (amount > 0)
      );
    `;
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
