### SQL Command History

This document logs the history of SQL commands executed.

## Table of Contents

1. Introduction
2. Setup
3. SQL Commands
4. Results
5. Notes

## Introduction

This practice is a process learning into PostgreSQL, focused on creating and managing a Doctor Hurt practice database. It covers the steps to setup and initialize a project and integrate it with Docker, and lists the commands to execute SQL queries to create a database with tight relationships. Finally, it covers the issues in the process of implementing a Doctor Hurt database.
Libraries used in Practice:

- [postgres](https://www.npmjs.com/package/postgres): Fastest full featured PostgreSQL client for Node.js. Used to execute SQL queries into the database.
- [faker.js](https://www.npmjs.com/package/@faker-js/faker): Generate massive amounts of fake contextual data.

## Setup

1. Require environment dowload

- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [Nodejs](https://nodejs.org/en)
- [Docker Desktop](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

2. Clone the repository
   | Command | Actions |
   | -------------------------------------------------------------------------- | -------------------------------------------------- |
   | git clone git@github.com:longnguyenthanh-agilityio/nodejs-training.git | Clone project from github |
   | git checkout -b develop | Switch to branch develop |
   | cd doctor-hurt-database | Move to folder doctor-hurt-database |
   | yarn install | Install all package of practice |

3. Create environent file

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5000
POSTGRES_USER=yourname
POSTGRES_PASSWORD=your-pass-database
POSTGRES_DB=db-name
```

4. Register local server on pgAdmin

- Should same value with your environment file

5. Build Docker compose

```
docker-compose up --build
```

- Note: Before build run command build docker, should open docker desktop first!

6. Sign in pgAdmin with your password

7. Stop and remove containers, networks, and volumes

```
docker compose down
```

## SQL Commands

Regarding database relationships, the commands need to be executed in the following order:
| Command | Actions |
| --------------------------------------- | ---------------------------------------------- |
| yarn setup-db | Create all tables and setup table relationship |
| node src/queries/insert-data/user.js | Insert data to table user |
| node src/queries/insert-data/patient.js | Insert data to table patient |
| node src/queries/insert-data/doctor.js | Insert data to table doctor |
| node src/queries/insert-data/booking.js | Insert data to table booking |
| node src/queries/insert-data/favorite.js | Insert data to table favorite |
| node src/queries/insert-data/review.js | Insert data to table review |
| node src/queries/insert-data/transaction.js | Insert data to table transaction |
| node src/queries/insert-data/payment.js | Insert data to table payment |
| node src/queries/insert-data/medicine-order.js | Insert data to table medicine-order |
| node src/queries/insert-data/medicine-record.js | Insert data to table medicine-record |
| node src/queries/insert-data/medicine.js | Insert data to table medicine |
| node src/queries/insert-data/medicine-order-item.js | Insert data to table medicine-order-item |
| node src/queries/insert-data/notification.js | Insert data to table notification |

## Notes

- Avoid using reserved keywords (e.g., user table) to name tables, as this can cause syntax errors or unexpected behavior.
- Always ensure that there is no semicolon or comma at the end of each query statement.
- The type definition of a column must be initialized before creating the table that contains the column.
- When inserting data into a table, avoid duplication by using the condition `user_id NOT IN (SELECT user_id FROM doctor)` to filter out duplicate IDs.
- NULL Handling Issues: Do not compare `NULL` values directly with `=.` Instead, use `IS NULL` or `IS NOT NULL` to check for `NULL` values.
- Data Type Mismatch: Ensure that the data being inserted matches the column's defined data type.
- To avoid conflicts in relationships between tables, create entity tables first and then define the relationships within the database.
