'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Shop_Type.init({
    type_number: DataTypes.INTEGER,
    icon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shop_Type',
  });
  return Shop_Type;
};