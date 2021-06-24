'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      authorId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'Users',
          key: 'id',
        }
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      shopType: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference: {
          model: 'Shop_Types',
          key: 'type_number',
        }
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      isPublic:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  }
};