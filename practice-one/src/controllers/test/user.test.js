import { jest } from "@jest/globals";
import db from "../../libs/db.js";

// Controllers
import { UserControllers } from "../../controllers/user.js";

// Constants
import { HTTP_STATUS } from "../../constants/http-status-code.js";
import { USER_INFO, USER_INFO_UPDATED } from "../../constants/mocks/user.js";
import { MESSAGES } from "../../constants/message.js";

jest.unstable_mockModule("../../models/User.js", () => {
  return {
    default: {
      findByPk: jest.fn(),
      destroy: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
});

describe("User controller", () => {
  let res, next, User;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true }); // Ensure the tables are created before tests
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    User = (await import("../../models/User.js")).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const req = {
        body: {
          name: "Long123123",
          password: "longlong12312344",
          email: "long1111@gmail.com.vn",
        },
      };

      User.create.mockResolvedValue(USER_INFO);

      await UserControllers(User).createUser(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toBeCalledWith(USER_INFO);
    });

    it("should create a new user failed and return an error", async () => {
      const mockError = new Error("Create user failed!");

      const req = {
        body: {
          name: "long nguyen",
        },
      };

      User.create.mockRejectedValue(mockError);
      await UserControllers(User).createUser(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe("getUserById", () => {
    it("should retrieve a user by ID", async () => {
      const req = {
        params: {
          id: "1",
        },
      };

      User.findByPk.mockResolvedValue(USER_INFO);

      await UserControllers(User).getUserById(req, res, next);
      expect(res.json).toBeCalledWith(USER_INFO);
    });

    it("should call next with message error when the user not found", async () => {
      const req = {
        params: { id: "2" },
      };

      User.findByPk.mockResolvedValue(null);

      await UserControllers(User).getUserById(req, res, next);
      expect(res.status).toBeCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toBeCalledWith({ message: MESSAGES.USER_NOT_FOUND });
    });

    it("should call get user by ID failed and return an error", async () => {
      const mockError = new Error("Get user failed!");
      const req = {
        params: { id: "2" },
      };

      User.findByPk.mockRejectedValue(mockError);
      await UserControllers(User).getUserById(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe("updateUserById", () => {
    it("should update a user by ID and return correct message", async () => {
      const req = {
        params: {
          id: "1",
        },
        body: USER_INFO_UPDATED,
      };

      User.update.mockResolvedValue(req.body, { where: req.params.id });
      await UserControllers(User).updateUser(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.OK);
      expect(res.json).toBeCalledWith(req.body);
    });

    it("should call update user by ID failed and return an error", async () => {
      const mockError = new Error("Update user failed!");

      const req = {
        params: {
          id: "1",
        },
      };

      User.update.mockRejectedValue(mockError);

      await UserControllers(User).updateUser(req, res, next);
      expect(next).toBeCalledWith(mockError);
    });
  });

  describe("deleteUserById", () => {
    it("should delete a user by ID successfully", async () => {
      const req = {
        params: {
          id: "1",
        },
      };

      User.destroy.mockResolvedValue(1);
      await UserControllers(User).deleteUser(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.OK);
    });

    it("should delete a user is invalid and return not found message", async () => {
      const req = {
        params: {
          id: "1",
        },
      };

      User.destroy.mockResolvedValue(0);
      await UserControllers(User).deleteUser(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.USER_NOT_FOUND,
      });
    });

    it("should call delete user by ID failed and return an error", async () => {
      const mockError = new Error("Delete user failed!");

      const req = {
        params: {
          id: "1",
        },
      };

      User.destroy.mockRejectedValue(mockError);

      await UserControllers(User).deleteUser(req, res, next);
      expect(next).toBeCalledWith(mockError);
    });
  });
});
