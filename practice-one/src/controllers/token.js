import jwt from "jwt-simple";
import { config } from "../libs/config.js";

// Constants
import { HTTP_STATUS } from "../constants/http-status-code.js";
import { MESSAGES } from "../constants/message.js";

export const TokenController = (UserModel) => {
  return {
    createToken: async (req, res, next) => {
      const { email, password } = req.body;
      const isValidateCredentials = !email || !password;

      if (isValidateCredentials) {
        res.status(HTTP_STATUS.UNAUTHORIZED);

        next(MESSAGES.UNAUTHORIZED_FAIL);
      }

      try {
        const user = await UserModel.findOne({ where: { email: email } });

        if (UserModel.isPassword(user.password, password)) {
          const payload = { id: user.id };
          res.json({
            token: jwt.encode(payload, config.jwtSecret),
          });
        } else {
          res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }
      } catch (error) {
        res.status(HTTP_STATUS.PRECONDITIONS_FAILED).json({ error: error.message });
      }
    },
  };
};
