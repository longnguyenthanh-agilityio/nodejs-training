"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Card", [
      {
        id: "1",
        cardType: "leaders",
        color: "red",
        cardName: "Son Go Ku Super sayan two Card",
        textBox: "Sample text",
        energyCost: "3000",
        zEnergyCost: 1000,
        power: 5000,
        comboPower: 1300,
        comboCost: 34,
        characterName: "Son Go Ku",
        specialTrait: "Sample text",
        era: "Sample text",
        cardNumber: "Card SGK123",
        rarity: "Sample text",
        block: "Sample text",
        illustration: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Card", null, {});
  },
};
