"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "google_id", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.changeColumn("Users", "password_hash", {
      type: Sequelize.STRING,
      allowNull: true, // Ahora permitimos NULL para usuarios de Google
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "google_id");
    await queryInterface.changeColumn("Users", "password_hash", {
      type: Sequelize.STRING,
      allowNull: false, // Volvemos a hacer obligatorio el password si se revierte
    });
  },
};
