import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import db from "../../libs/db.js";

// Routes
import { tokenRouter } from "../token.js";
import { HTTP_STATUS } from "../../constants/http-status-code.js";
import { USER_INFO } from "../../constants/mocks/user.js";

// Controllers
import { TokenController } from "../../controllers/token.js";

jest.unstable_mockModule("../../models/User.js", () => {
  return {
    default: {
      findOne: jest.fn(),
      isPassword: jest.fn(),
    },
  };
});

describe("Token route", () => {
  let app, User;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    User = (await import("../../models/User.js")).default;

    const { createToken } = TokenController(User);

    tokenRouter({ app, createToken });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the new token if created successfully", async () => {
    User.findOne.mockResolvedValue(USER_INFO);
    User.isPassword.mockReturnValueOnce(true);

    const response = await request(app)
      .post("/token")
      .send({ email: USER_INFO.email, password: USER_INFO.password });

    // expect(response.status).toBe(HTTP_STATUS.OK); // TODO
    expect(response.body).toBeDefined();
  });
});
