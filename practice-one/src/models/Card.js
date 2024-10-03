import { DataTypes } from "sequelize";
import db from "../libs/db.js";

// Constants
import { CARD_TYPE } from "../constants/card.js";
import { MESSAGES } from "../constants/message.js";

const Cards = db.sequelize.define("Cards", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
  },
  cardType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [CARD_TYPE],
    },
  },
  color: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  cardName: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  energyCost: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  zEnergyCost: {
    type: DataTypes.STRING,
    validate: {
      startsWithZ(value) {
        if (!value.startsWith("z-")) {
          throw new Error(MESSAGES.Z_ENERGY_COST);
        }
      },
    },
  },
  power: {
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  comboPower: {
    type: DataTypes.INTEGER,
    defaultValue: false,
  },
  comboCost: {
    type: DataTypes.INTEGER,
    defaultValue: false,
  },
  characterName: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  specialTrait: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  era: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  Illustration: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cardNumber: {
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  rarity: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  block: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  bundlingNumber: {
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  copyrightNotice: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
});

Cards.associate = (models) => {
  Cards.belongsTo(models.Users);
};

export default Cards;
