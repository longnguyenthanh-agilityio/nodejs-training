"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update address for specific User
    await queryInterface.bulkUpdate(
      "User",
      { address: "123 Updated St" }, // New address value
      { id: 1 }, // Condition to match specific User
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the address update if needed
    await queryInterface.bulkUpdate("User", { address: null }, { id: 1 });
  },
};
