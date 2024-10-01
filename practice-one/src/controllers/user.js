import { ERROR_MESSAGES } from "../constants/message.js";
import { HTTP_STATUS } from "../constants/http-status-code.js";

// TODO: Will update more in this function
export const UserControllers = (userModel) => {
  return {
    getUserById: async (req, res, next) => {
      const userId = req.params.id;

      try {
        const user = await userModel.findById(userId, {
          attributes: ["id", "name", "email"],
        });
        if (user) {
          res.json(user);
        } else {
          res.sendStatus(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
        }
      } catch (error) {
        next(error);
      }
    },
  };
};
