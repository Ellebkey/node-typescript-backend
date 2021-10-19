'use strict';
const bcrypt = require('bcrypt');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const now = new Date();
const devAccounts = [
  {
    email: 'admin@email.com',
    display_name: 'admin',
    roles: ['admin']
  },
 ];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('my-app-name', 10);
    const usersToAdd = devAccounts.map(({email, display_name, roles}) => ({
      id: uuidv4(),
      email,
      display_name,
      roles: JSON.stringify(roles),
      hashed_password: password,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('user', usersToAdd);
  },

  down: async (queryInterface, Sequelize) => {
    for (const {email} of devAccounts) {
      await queryInterface.sequelize.query(`delete from user where email = '${email}'`);
    }
  }
};
