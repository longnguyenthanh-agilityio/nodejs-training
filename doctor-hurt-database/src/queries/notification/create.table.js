import sql from "../../libs/db.js";

export const createNotificationTable = async () => {
  try {
    await sql`
      CREATE TYPE notification_type AS ENUM ('appointment', 'payment', 'review', 'general');
    `;

    await sql`
      CREATE TYPE notification_status AS ENUM ('unread', 'read');
    `;

    await sql`
      CREATE TABLE notification (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type notification_type NOT NULL,
        status notification_status DEFAULT 'unread'
      );
    `;
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
