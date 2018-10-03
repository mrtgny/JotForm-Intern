'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('form_structure', {
      record_id: {
        type: Sequelize.STRING
      },
      dsc: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('form_structure');
  }
};