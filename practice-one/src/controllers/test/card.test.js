import { jest } from "@jest/globals";
import db from "../../libs/db.js";

// Controllers
import { CardControllers } from "../../controllers/card.js";

// Constants
import { HTTP_STATUS } from "../../constants/http-status-code.js";
import { CARD_INFO, CARDS, CARD_QUERY } from "../../constants/mocks/card.js";
import { MESSAGES } from "../../constants/message.js";

jest.unstable_mockModule("../../models/card.js", () => {
  return {
    default: {
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
});

describe("Card controller", () => {
  let res, next, Card;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  beforeEach(async () => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    Card = (await import("../../models/Card.js")).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCard", () => {
    it("should create a new card successfully", async () => {
      const req = {
        body: CARD_INFO,
        user: {
          id: 1,
        },
      };

      Card.create.mockResolvedValue({ ...CARD_INFO, id: 1 });

      await CardControllers(Card).createCard(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toBeCalledWith({ ...CARD_INFO, id: 1 });
    });

    it("should create a new card failed and return an error", async () => {
      const mockError = new Error("Create card failed!");

      const req = {
        body: {
          name: "long nguyen",
        },
        user: {
          id: 1,
        },
      };

      Card.create.mockRejectedValue(mockError);
      await CardControllers(Card).createCard(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe("updateCard", () => {
    it("should update card successfully", async () => {
      CARD_INFO.cardName = "Card new updated";

      const req = {
        body: CARD_INFO,
        params: {
          id: 1,
        },
      };

      Card.update.mockResolvedValue(req.body, { where: req.params.id });
      await CardControllers(Card).updateCard(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.OK);
      expect(res.json).toBeCalledWith({ message: MESSAGES.CARD_UPDATED });
    });

    it("should update card failed and return an error", async () => {
      const mockError = new Error("Create card failed!");

      const req = {
        body: {},
        params: {
          id: 1,
        },
      };

      Card.update.mockRejectedValue(mockError);
      await CardControllers(Card).updateCard(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe("getCardById", () => {
    it("should retrieve a card by ID", async () => {
      const req = {
        params: {
          id: "1",
        },
      };

      Card.findByPk.mockResolvedValue(CARD_INFO);
      await CardControllers(Card).getCardById(req, res, next);

      expect(res.json).toBeCalledWith(CARD_INFO);
    });

    it("should call get card by ID failed and return an error", async () => {
      const mockError = new Error("Get card failed!");
      const req = {
        params: { id: 2 },
      };

      Card.findByPk.mockRejectedValue(mockError);
      await CardControllers(Card).getCardById(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });

    it("should call next with message error when the card not found", async () => {
      const req = {
        params: { id: 2 },
      };

      Card.findByPk.mockResolvedValue(null);

      await CardControllers(Card).getCardById(req, res, next);
      expect(res.status).toBeCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toBeCalledWith({ message: MESSAGES.CARD_NOT_FOUND });
    });
  });
  describe("deleteCardById", () => {
    it("should delete a Card by ID successfully", async () => {
      const req = {
        params: {
          id: "1",
        },
      };

      Card.destroy.mockResolvedValue(1);
      await CardControllers(Card).deleteCard(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.OK);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.CARD_DELETED,
      });
    });

    it("should delete a card is invalid and return not found message", async () => {
      const req = {
        params: {
          id: "1",
        },
      };

      Card.destroy.mockResolvedValue(0);
      await CardControllers(Card).deleteCard(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.CARD_NOT_FOUND,
      });
    });

    it("should call delete card by ID failed and return an error", async () => {
      const mockError = new Error("Delete card failed!");

      const req = {
        params: {
          id: "1",
        },
      };

      Card.destroy.mockRejectedValue(mockError);

      await CardControllers(Card).deleteCard(req, res, next);
      expect(next).toBeCalledWith(mockError);
    });
  });
  describe("deleteCardById", () => {
    it("should get filtered card list successfully", async () => {
      const req = {
        query: CARD_QUERY,
      };

      const mockFilteredCards = {
        rows: CARDS,
        count: CARDS.length,
      };

      Card.findAndCountAll.mockResolvedValue(mockFilteredCards);

      await CardControllers(Card).getCardList(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.OK);
      expect(res.json).toBeCalledWith({
        cards: CARDS,
        pagination: {
          totalPages: 1,
          totalItems: CARDS.length,
          currentPage: parseInt(1, 10),
          nextPage: null,
          previousPage: null,
        },
      });
    });

    it("should get filtered card list successfully but in case no filter correct", async () => {
      const req = {
        query: { color: "red" }, // wrong filter
      };

      const mockFilteredCards = {
        rows: CARDS,
        count: CARDS.length,
      };

      Card.findAndCountAll.mockResolvedValue(mockFilteredCards);
      await CardControllers(Card).getCardList(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.OK);
      expect(res.json).toBeCalledWith({
        cards: CARDS,
        pagination: {
          totalPages: 1,
          totalItems: CARDS.length,
          currentPage: 1,
          nextPage: null,
          previousPage: null,
        },
      });
    });

    it("should get filtered card list successfully in case next page", async () => {
      const req = {
        query: { page: 2 },
      };

      const mockFilteredCards = {
        rows: CARDS,
        count: 31,
      };

      Card.findAndCountAll.mockResolvedValue(mockFilteredCards);
      await CardControllers(Card).getCardList(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS.OK);
      expect(res.json).toBeCalledWith({
        cards: CARDS,
        pagination: {
          totalPages: 4,
          totalItems: 31,
          currentPage: req.query.page,
          nextPage: 3,
          previousPage: 1,
        },
      });
    });

    it("should call get card list failed and return an error", async () => {
      const mockError = new Error("Get cards failed!");

      const req = {
        query: { page: 1 },
      };

      Card.findAndCountAll.mockRejectedValue(mockError);

      await CardControllers(Card).getCardList(req, res, next);
      expect(next).toBeCalledWith(mockError);
    });
  });
});
