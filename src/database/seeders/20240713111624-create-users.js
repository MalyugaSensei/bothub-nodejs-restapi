'use strict';

const { constants: { USER_TABLE } } = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(USER_TABLE, [
        {
          id: 1,
          username: 'Malyuga',
          email: 'user1@example.com',
          password: '$argon2id$v=19$m=65536,t=3,p=4$KuhTpGaWl8eMXQogYSmhFQ$/cEEG7E5Bu1IxpPc74ZTCF/Aqmsee108jCtAPFayjn0',
          role: 0,
          confirmed: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          username: 'Administrator',
          email: 'admin@example.com',
          password: '$argon2id$v=19$m=65536,t=3,p=4$KuhTpGaWl8eMXQogYSmhFQ$/cEEG7E5Bu1IxpPc74ZTCF/Aqmsee108jCtAPFayjn0',
          role: 1,
          confirmed: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      //@ts-ignore
      await queryInterface.bulkDelete(USER_TABLE, null, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
