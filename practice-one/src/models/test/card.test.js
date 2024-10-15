import db from "../../libs/db.js";
// Models
import Card from "../Card.js";

// Constants
import { CARD_INFO } from "../../constants/mocks/card.js";

describe("Card Model", () => {
  let cardInstance;

  beforeAll(async () => {
    // Initialize database connection
    await db.sequelize.authenticate();
    await db.sequelize.sync(); // Sync models for testing
  });

  beforeEach(async () => {
    cardInstance = Card.build({ ...CARD_INFO });
  });

  it("should create a card instance correct with data mocked", async () => {
    const cardWithoutUUID = cardInstance.dataValues;
    delete cardWithoutUUID.id;

    const cardWithDefaultField = {
      ...CARD_INFO,
      copyrightNotice: null,
      block: null,
    };

    expect(cardWithoutUUID).toEqual(cardWithDefaultField);
  });
});
