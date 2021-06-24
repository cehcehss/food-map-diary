'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Post.init({
    authorId:DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    shopType: DataTypes.INTEGER,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    isPublic:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};