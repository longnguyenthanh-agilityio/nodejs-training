import { jest } from "@jest/globals";
import db from "../../libs/db.js";

// Controllers
import { TokenController } from "../../controllers/token.js";

// Constants
import { HTTP_STATUS } from "../../constants/http-status-code.js";
import { USER_INFO } from "../../constants/mocks/user.js";
import { MESSAGES } from "../../constants/message.js";

jest.unstable_mockModule("../../models/user.js", () => {
  return {
    default: {
      findOne: jest.fn(),
      create: jest.fn(),
      isPassword: jest.fn(),
    },
  };
});

describe("Token controller", () => {
  let res, next, User;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  beforeEach(async () => {
    res = {
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    User = (await import("../../models/User.js")).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createToken", () => {
    it("should create a new token successfully", async () => {
      const req = {
        body: {
          email: USER_INFO.email,
          password: USER_INFO.password,
        },
      };

      User.findOne.mockResolvedValue(USER_INFO);
      User.isPassword.mockResolvedValue(true);

      await TokenController(User).createToken(req, res, next);
      expect(res.json).toBeDefined();
    });

    it("should return correct message in case password or email is empty", async () => {
      const req = {
        body: {
          email: USER_INFO.email,
          password: "",
        },
      };

      User.findOne.mockResolvedValue(USER_INFO);
      User.isPassword.mockResolvedValue(false);

      await TokenController(User).createToken(req, res, next);
      expect(res.status).toBeCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(next).toBeCalledWith(MESSAGES.UNAUTHORIZED_FAIL);
    });

    it("should return correct status in case wrong password", async () => {
      const req = {
        body: {
          email: USER_INFO.email,
          password: "555",
        },
      };

      User.findOne.mockResolvedValue(USER_INFO);
      User.isPassword.mockReturnValueOnce(false);
      await TokenController(User).createToken(req, res, next);

      expect(res.sendStatus).toBeCalledWith(HTTP_STATUS.UNAUTHORIZED);
    });

    it("should return correct message and status in case not found correct the user", async () => {
      const mockError = new Error("Create token failed!");

      const req = {
        body: {
          email: USER_INFO.email,
          password: USER_INFO.password,
        },
      };

      User.findOne.mockRejectedValue(mockError);
      User.isPassword.mockResolvedValue(false);

      await TokenController(User).createToken(req, res, next);
      expect(res.status).toBeCalledWith(HTTP_STATUS.PRECONDITIONS_FAILED);
      expect(res.json).toBeCalledWith({ error: mockError.message });
    });
  });
});
