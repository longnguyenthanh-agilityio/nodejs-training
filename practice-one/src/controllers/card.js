import { Op } from "sequelize";

import { MESSAGES } from "../constants/message.js";
import { HTTP_STATUS } from "../constants/http-status-code.js";

export const CardControllers = (cardModel) => {
  return {
    /**
     * Get a list of cards with pagination and filtering options.
     *
     * @param {Object} req - The request object, containing query parameters for filtering and pagination.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Promise<void>} Responds with paginated and filtered card list or passes error to the next middleware.
     */
    getCardList: async (req, res, next) => {
      const { page = 1, limit = 10, ...filters } = req.query;
      const offset = (page - 1) * limit;

      // Dynamically build filter based on available query parameters
      const filter = Object.keys(filters).reduce((acc, key) => {
        if (filters[key]) {
          switch (key) {
            case "cardType":
            case "power":
            case "comboPower":
            case "bundlingNumber":
              acc[key] = filters[key];
              break;
            case "cardName":
            case "zEnergyCost":
            case "characterName":
            case "era":
            case "cardNumber":
            case "rarity":
              acc[key] = { [Op.like]: `%${filters[key]}%` };
              break;
            default:
              break;
          }
        }
        return acc;
      }, {});

      try {
        const { count, rows } = await cardModel.findAndCountAll({
          where: filter,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["createdAt", "DESC"]],
        });

        const totalPages = Math.ceil(count / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        return res.status(HTTP_STATUS.OK).json({
          cards: rows,
          pagination: {
            totalPages,
            totalItems: count,
            currentPage: parseInt(page, 10),
            nextPage,
            previousPage,
          },
        });
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
        const cardUpdated = await cardModel.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
        res.status(HTTP_STATUS.OK).json(cardUpdated);
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
        return res.status(HTTP_STATUS.OK);
      } catch (error) {
        return next(error);
      }
    },
  };
};
