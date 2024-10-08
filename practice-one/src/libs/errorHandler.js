import { HTTP_STATUS } from "../constants/http-status-code.js";
import { MESSAGES } from "../constants/message.js";

export const errorHandler = (err, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES;
  res.status(statusCode).json({ error: message });
};
