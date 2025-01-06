-- Step 1: Create ENUM type for the 'role' column
CREATE TYPE user_role AS ENUM ('patient', 'doctor');

-- Step 2: Create the table
CREATE TABLE "user" (
    user_id VARCHAR(255) PRIMARY KEY UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone_number INT,
    address TEXT,
    date_of_birth DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL
);

-- Step 3: Create the patient table
CREATE TABLE patient (
    patient_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE,  -- This will reference user_id in the "user" table
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id)
    REFERENCES "user"(user_id)
    ON DELETE CASCADE
);

-- Step 4: Create the doctor table
CREATE TABLE doctor (
    doctor_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE,  -- This will reference user_id in the "user" table
    rating_point DECIMAL(3, 2),
    specialization VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    price INT,
    booking_success INT,
    booking_cancel INT,
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id)
    REFERENCES "user"(user_id)
    ON DELETE CASCADE
);

-- Step 5: Create ENUM type for the 'status' column
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'canceled', 'completed');

-- Step 6: Create the booking table
CREATE TABLE booking (
    id VARCHAR(255) PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,  -- Foreign key to patient table
    doctor_id VARCHAR(255) NOT NULL,   -- Foreign key to doctor table
    patient_name VARCHAR(255),
    contact_number VARCHAR(50),   -- Updated to VARCHAR to store phone numbers properly
    address TEXT,
    booking_date DATE,
    booking_time TIME,
    cancel_reason VARCHAR(255),
    cancel_at TIMESTAMP,
    status booking_status DEFAULT 'pending',
    CONSTRAINT fk_booking_patient FOREIGN KEY (patient_id)
    REFERENCES patient(patient_id)
    ON DELETE CASCADE,
    CONSTRAINT fk_booking_doctor FOREIGN KEY (doctor_id)
    REFERENCES doctor(doctor_id)
    ON DELETE CASCADE
);

-- Step 7: Create the review table
CREATE TABLE review (
    id VARCHAR(255) PRIMARY KEY,                -- Unique review ID
    doctor_id VARCHAR(255) NOT NULL,            -- Foreign key referencing doctors
    patient_id VARCHAR(255) NOT NULL,           -- Foreign key referencing patients
    rating INT CHECK (rating >= 1 AND rating <= 5),  -- Rating out of 5 stars
    review_text TEXT,                      -- Optional text review
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Review creation time
    CONSTRAINT fk_review_doctor FOREIGN KEY (doctor_id)
    REFERENCES doctor(doctor_id)
    ON DELETE CASCADE,
    CONSTRAINT fk_review_patient FOREIGN KEY (patient_id)
    REFERENCES patient(patient_id)
    ON DELETE CASCADE
);

-- step 8: Create the favorite table
CREATE TABLE favorite (
    id VARCHAR(255) PRIMARY KEY,                -- Unique favorite ID
    doctor_id VARCHAR(255) NOT NULL,            -- Foreign key referencing doctor table
    patient_id VARCHAR(255) NOT NULL,           -- Foreign key referencing patient table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Favorite creation time
    CONSTRAINT fk_favorite_doctor FOREIGN KEY (doctor_id)
    REFERENCES doctor(doctor_id)
    ON DELETE CASCADE,
    CONSTRAINT fk_favorite_patient FOREIGN KEY (patient_id)
    REFERENCES patient(patient_id)
    ON DELETE CASCADE,
    CONSTRAINT unique_favorite UNIQUE (doctor_id, patient_id) -- Ensure one-to-one relationship
);

-- step 9: Create ENUM type for the 'status' and 'type' column
CREATE TYPE notification_type AS ENUM ('appointment', 'payment', 'review', 'general');
CREATE TYPE notification_status AS ENUM ('unread', 'read');

-- step 10: Create the notification table
CREATE TABLE notification (
    id VARCHAR(255) PRIMARY KEY,                -- Unique notification ID
    user_id VARCHAR(255) NOT NULL,              -- Foreign key referencing the user table
    title VARCHAR(255) NOT NULL,                -- Notification title or summary
    message TEXT NOT NULL,                 -- Detailed notification message
    type notification_type NOT NULL,       -- Notification type ENUM
    status notification_status DEFAULT 'unread', -- Notification status ENUM
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id)
    REFERENCES "user"(user_id)
    ON DELETE CASCADE
);

-- step 11: Create ENUM type for the 'status' column
CREATE TYPE transaction_status AS ENUM ('success', 'failed', 'pending');

-- step 12: Create the notification table
CREATE TABLE transaction (
    id VARCHAR(255) PRIMARY KEY,                 -- Unique transaction ID
    booking_id VARCHAR(255) NOT NULL UNIQUE,      -- Foreign key referencing the booking table
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Transaction timestamp
    status transaction_status NOT NULL,      -- Transaction status ENUM
    CONSTRAINT fk_transaction_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);

-- step 13: Create ENUM type for the 'status' and 'method' column
CREATE TYPE payment_method_type AS ENUM ('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash');
CREATE TYPE payment_status_type AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- step 14: Create the payment table
CREATE TABLE payment (
    id VARCHAR(255) PRIMARY KEY,                    -- Unique payment ID
    amount DECIMAL(10, 2) NOT NULL,            -- Total payment amount
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Payment transaction date and time
    payment_method payment_method_type NOT NULL, -- Payment method ENUM
    status payment_status_type DEFAULT 'pending', -- Payment status ENUM
    transaction_id VARCHAR(255) NOT NULL UNIQUE,                    -- External transaction ID for reference
    CONSTRAINT fk_payment_transaction FOREIGN KEY (transaction_id)
    REFERENCES transaction(id)
    ON DELETE CASCADE,
    CONSTRAINT chk_positive_amount CHECK (amount > 0) -- Ensure positive payment amount
);

-- step 15: Create the medicine_order table
CREATE TABLE medicine_order (
    id VARCHAR(255) PRIMARY KEY,                        -- Unique medicine order ID
    booking_id VARCHAR(255) NOT NULL UNIQUE,                   -- Foreign key referencing the booking table
    prescription TEXT NOT NULL,                    -- Prescription details
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Order creation date
    CONSTRAINT fk_medicine_order_booking FOREIGN KEY (booking_id)
    REFERENCES booking(id)
    ON DELETE CASCADE
);

-- step 16: Create ENUM type for the 'type' column
CREATE TYPE medical_record_type AS ENUM ('invoice', 'prescription', 'report');

-- step 17: Create the medical_record table
CREATE TABLE medical_record (
    id VARCHAR(255) PRIMARY KEY,                        -- Unique medical record ID
    booking_id VARCHAR(255) NOT NULL UNIQUE,            -- Foreign key referencing the booking table
    type medical_record_type NOT NULL,             -- Medical record type ENUM
    image_path VARCHAR(255),                            -- Path to the image or file
    created_at DATE DEFAULT CURRENT_DATE,          -- Record creation date
    CONSTRAINT fk_medical_record_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);

-- step 18: Create the medicine_order_item table
CREATE TABLE medicine (
    id VARCHAR(255) PRIMARY KEY,                   -- Unique medicine ID
    name VARCHAR(255) NOT NULL,                    -- Medicine name
    description TEXT,                         -- Medicine description
    manufacturer VARCHAR(255)                      -- Manufacturer details
);

-- step 19: Create the medicine_order_item table
CREATE TABLE medicine_order_item (
    id VARCHAR(255) PRIMARY KEY,                     -- Unique order item ID
    order_id VARCHAR(255) NOT NULL,                  -- Foreign key referencing the medicine_order table
    medicine_id VARCHAR(255) NOT NULL,               -- Foreign key referencing the medicine table
    quantity INT NOT NULL,                      -- Quantity of the medicine in the order
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES medicine_order(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_medicine FOREIGN KEY (medicine_id) REFERENCES medicine(id) ON DELETE CASCADE,
    CONSTRAINT chk_positive_quantity CHECK (quantity > 0) -- Ensure positive quantity
);
