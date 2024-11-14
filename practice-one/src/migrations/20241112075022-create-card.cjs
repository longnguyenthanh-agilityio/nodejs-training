"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Card", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      cardType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cardName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      textBox: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      energyCost: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zEnergyCost: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      power: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      comboPower: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      comboCost: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      characterName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      specialTrait: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      era: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      illustration: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cardNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rarity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      block: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      bundlingNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      copyrightNotice: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Card");
  },
};
