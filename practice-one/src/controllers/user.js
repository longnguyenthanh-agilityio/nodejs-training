import { MESSAGES } from "../constants/message.js";
import { HTTP_STATUS } from "../constants/http-status-code.js";

export const UserControllers = (userModel) => {
  return {
    /**
     * Get user by ID.
     *
     * @param {Object} req - Express request object containing the user ID in `req.params.id`.
     * @param {Object} res - Express response object used to send the JSON response.
     * @param {Function} next - Express middleware next function to handle errors.
     * @returns {Object} Returns a JSON object containing the user's `id`, `name`, and `email` if found.
     * If the user is not found, returns a 404 status with an error message.
     */
    getUserById: async (req, res, next) => {
      const userId = req.params.id;

      try {
        const user = await userModel.findByPk(userId, {
          attributes: ["id", "name", "email"],
        });
        if (user) {
          res.json(user);
        } else {
          res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
        }
      } catch (error) {
        next(error);
      }
    },
    /**
     * Create a new user.
     *
     * @param {Object} req - Express request object containing the new user data in `req.body`.
     * @param {Object} res - Express response object used to send the JSON response.
     * @param {Function} next - Express middleware next function to handle errors.
     * @returns {Object} Returns a JSON object of the newly created user and sends a 201 status code.
     */
    createUser: async (req, res, next) => {
      try {
        const newUser = await userModel.create(req.body);
        res.status(HTTP_STATUS.CREATED).json(newUser);
      } catch (error) {
        next(error);
      }
    },
    /**
     * Update user by ID.
     *
     * @param {Object} req - Express request object containing the updated user data in `req.body` and the user ID in `req.params.id`.
     * @param {Object} res - Express response object used to send the JSON response.
     * @param {Function} next - Express middleware next function to handle errors.
     * @returns {Object} If the user is found and updated, returns a 200 status with a success message.
     */
    updateUser: async (req, res, next) => {
      try {
        await userModel.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
        res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USER_UPDATED });
      } catch (error) {
        next(error);
      }
    },
    /**
     * Delete user by ID.
     *
     * @param {Object} req - Express request object containing the user ID in `req.params.id`.
     * @param {Object} res - Express response object used to send the JSON response.
     * @param {Function} next - Express middleware next function to handle errors.
     * @returns {Object} Returns a 200 status with a success message if the user is deleted successfully.
     */
    deleteUser: async (req, res, next) => {
      try {
        const isDeleted = await userModel.destroy({ where: { id: req.params.id } });

        // If no user is deleted, send a 404 response
        if (isDeleted === 0) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
        }

        // Send success response if user is deleted
        return res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USER_DELETED });
      } catch (error) {
        return next(error);
      }
    },
  };
};
