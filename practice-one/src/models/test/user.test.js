import db from "../../libs/db.js";

// Models
import User from "../User.js";

// Constants
import { USER_INFO } from "../../constants/mocks/user.js";

describe("User Model", () => {
  let userInstance;

  beforeAll(async () => {
    // Initialize database connection
    await db.sequelize.authenticate();
    await db.sequelize.sync(); // Sync models for testing
  });

  beforeEach(async () => {
    userInstance = User.build(USER_INFO);
  });

  it("should create a user instance", () => {
    expect(userInstance).toBeDefined();
    expect(userInstance.name).toBe(USER_INFO.name);
    expect(userInstance.email).toBe(USER_INFO.email);
  });

  it("should hash the password before creating a user", async () => {
    // Manually invoke the beforeCreate hook
    const reqBody = {
      name: USER_INFO.name,
      email: USER_INFO.email,
      password: USER_INFO.password,
    };

    const hashUser = (await User.create(reqBody)).dataValues;
    const isValid = await User.isPassword(hashUser.password, USER_INFO.password);

    expect(isValid).toBe(true); // valid password
    expect(hashUser.email).toEqual(USER_INFO.email); // still correct email
    expect(expect.not.stringMatching(hashUser.password)).toEqual(USER_INFO.password); // password not equal with password mocked
  });
});
