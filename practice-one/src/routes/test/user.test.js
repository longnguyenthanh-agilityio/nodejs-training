import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import db from "../../libs/db.js";

import { HTTP_STATUS } from "../../constants/http-status-code.js";
import { USER_INFO } from "../../constants/mocks/user.js";
import { MESSAGES } from "../../constants/message.js";

// Controllers
import { usersRouter } from "../../routes/users.js";

const mockCreateUser = jest.fn((req, res, next) => res.status(HTTP_STATUS.CREATED).json(USER_INFO));
const mockGetUserById = jest.fn((req, res, next) => res.json(USER_INFO));
const mockDeleteUserById = jest.fn((req, res, next) =>
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USER_DELETED }),
);
const mockUpdateUser = jest.fn((req, res, next) =>
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USER_UPDATED }),
);
const mockAuthenticate = jest.fn((req, res, next) => {
  // Simulate authentication
  if (req.headers.authorization) {
    next();
  } else {
    res.status(HTTP_STATUS.UNAUTHORIZED).send("Unauthorized");
  }
});

describe("User route", () => {
  let app;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    usersRouter({
      app,
      authenticate: mockAuthenticate,
      getUserById: mockGetUserById,
      createUser: mockCreateUser,
      deleteUser: mockDeleteUserById,
      updateUser: mockUpdateUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users", () => {
    it("should return 201 and the new user if created successfully", async () => {
      const response = await request(app)
        .post("/users")
        .send({ name: USER_INFO.name, email: USER_INFO.email, password: USER_INFO.password });

      expect(response.status).toBe(HTTP_STATUS.CREATED);
    });
  });

  describe("GET /users", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/users/1");

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.text).toBe("Unauthorized");
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    it("should return user data if authenticated", async () => {
      const response = await request(app).get("/users/1").set("Authorization", "Bearer token");

      expect(response.body).toEqual(USER_INFO);
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(mockGetUserById).toHaveBeenCalled();
    });
  });
});
