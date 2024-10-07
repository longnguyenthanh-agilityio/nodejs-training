import { MESSAGES } from "../constants/message.js";
import { HTTP_STATUS } from "../constants/http-status-code.js";

export const CardControllers = (cardModel) => {
  return {
    // TODO: Will update in next MR
    getCardList: async (req, res, next) => {
      try {
        const response = await cardModel.findAll();
        res.json(response);
      } catch (error) {
        next(error);
      }
    },
    createCard: async (req, res, next) => {
      /**
       * Creates a new card record in the database.
       *
       * @param {Object} req - The request object, containing the card data in `req.body` and user information in `req.user`.
       * @param {Object} res - The response object.
       * @param {Function} next - Callback to pass errors to the next middleware.
       * @returns {Promise<void>} Responds with the created card or passes the error to the next middleware.
       */
      try {
        const newCard = await cardModel.create({
          ...req.body,
          userId: req.user.id,
        });

        res.status(HTTP_STATUS.CREATED).json(newCard);
      } catch (error) {
        next(error);
      }
    },

    updateCard: async (req, res, next) => {
      /**
       * Updates an existing card by its ID.
       *
       * @param {Object} req - The request object, containing the updated card data in `req.body` and the card ID in `req.params.id`.
       * @param {Object} res - The response object.
       * @param {Function} next - Callback to pass errors to the next middleware.
       * @returns {Promise<void>} Responds with a success message or passes the error to the next middleware.
       */
      try {
        await cardModel.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
        res.status(HTTP_STATUS.OK).json({ message: MESSAGES.CARD_UPDATED });
      } catch (error) {
        next(error);
      }
    },

    getCardById: async (req, res, next) => {
      /**
       * Retrieves a card by its ID.
       *
       * @param {Object} req - The request object, containing the card ID in `req.params.id`.
       * @param {Object} res - The response object.
       * @param {Function} next - Callback to pass errors to the next middleware.
       * @returns {Promise<void>} Responds with the card details if found, otherwise sends a 404 response.
       */
      const cardId = req.params.id;

      try {
        const card = await cardModel.findByPk(cardId);
        if (card) {
          res.json(card);
        } else {
          res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.CARD_NOT_FOUND });
        }
      } catch (error) {
        next(error);
      }
    },

    deleteCard: async (req, res, next) => {
      /**
       * Deletes a card by its ID.
       *
       * @param {Object} req - The request object, containing the card ID in `req.params.id`.
       * @param {Object} res - The response object.
       * @param {Function} next - Callback to pass errors to the next middleware.
       * @returns {Promise<void>} Responds with a success message if the card is deleted, otherwise sends a 404 response.
       */
      try {
        const isDeleted = await cardModel.destroy({ where: { id: req.params.id } });

        // If no card is deleted, send a 404 response
        if (isDeleted === 0) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.CARD_NOT_FOUND });
        }

        // Send success response if card is deleted
        return res.status(HTTP_STATUS.OK).json({ message: MESSAGES.CARD_DELETED });
      } catch (error) {
        return next(error);
      }
    },
  };
};
