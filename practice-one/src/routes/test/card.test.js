import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import db from "../../libs/db.js";

// Constants
import { HTTP_STATUS } from "../../constants/http-status-code.js";
import { CARDS, CARD_INFO } from "../../constants/mocks/card.js";
import { MESSAGES, FIELD_INVALID } from "../../constants/message.js";

// Controllers
import { cardsRouter } from "../../routes/cards.js";

jest.unstable_mockModule("../../libs/auth.js", () => ({
  passportAuth: jest.fn(() => ({
    authenticate: jest.fn().mockImplementation(() => (req, res, next) => next()),
  })),
}));

const mockCreateCard = jest.fn((req, res, next) => res.status(HTTP_STATUS.CREATED).json());
const mockGetCardById = jest.fn((req, res, next) => res.json(CARD_INFO));
const mockDeleteCardById = jest.fn((req, res, next) =>
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USER_DELETED }),
);
const mockGetCardList = jest.fn((req, res) => res.status(200).send(CARDS));

const mockValidateCard = jest.fn((req, res, next) =>
  res.status(HTTP_STATUS.CREATED).json({ message: FIELD_INVALID("cardType") }),
);
const mockUpdateCard = jest.fn((req, res, next) =>
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.CARD_UPDATED }),
);
const mockAuthenticate = jest.fn((req, res, next) => {
  // Simulate authentication
  if (req.headers.authorization) {
    next();
  } else {
    res.status(HTTP_STATUS.UNAUTHORIZED).send("Unauthorized");
  }
});

describe("Card route", () => {
  let app;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    cardsRouter({
      app,
      authenticate: mockAuthenticate,
      createCard: mockCreateCard,
      cardValidations: mockValidateCard,
      getCardList: mockGetCardList,
      getCardById: mockGetCardById,
      deleteCard: mockDeleteCardById,
      updateCard: mockUpdateCard,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /cards", () => {
    it("should return 201 and the new user if created successfully", async () => {
      const response = await request(app)
        .post("/cards")
        .set("Authorization", "Bearer token")
        .send(CARD_INFO);

      expect(response.status).toBe(HTTP_STATUS.CREATED);
      expect(mockValidateCard).toHaveBeenCalled();
    });

    it("should return 401 if not authenticated", async () => {
      const response = await request(app)
        .post("/cards")
        .send({ ...CARD_INFO, cardType: "" });

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.text).toBe("Unauthorized");
      expect(mockValidateCard).toHaveBeenCalledTimes(0);
      expect(mockCreateCard).toHaveBeenCalledTimes(0);
    });
  });
});
