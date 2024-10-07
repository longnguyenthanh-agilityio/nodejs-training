import { DataTypes } from "sequelize";
import db from "../libs/db.js";

// Constants
import { CARD_TYPES } from "../constants/card.js";
import { MESSAGES } from "../constants/message.js";

const Card = db.sequelize.define("Card", {
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
      isIn: [CARD_TYPES],
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
  textBox: {
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
    defaultValue: null,
  },
  comboCost: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  characterName: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  specialTrait: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  era: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  illustration: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cardNumber: {
    type: DataTypes.STRING,
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
    defaultValue: null,
  },
  bundlingNumber: {
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  copyrightNotice: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Card.associate = (models) => {
  Card.belongsTo(models.User);
};

export default Card;
