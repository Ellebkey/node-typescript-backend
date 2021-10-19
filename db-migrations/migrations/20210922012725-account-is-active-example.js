'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'account',
      'is_active',
      {
        type: Sequelize.BOOLEAN,
        field: 'is_active',
        defaultValue: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('account', 'is_active');
  }
};

