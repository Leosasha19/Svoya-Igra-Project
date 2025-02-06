'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GameProgress.belongsTo(models.Player, {foreignKey: 'userId'});
      GameProgress.belongsTo(models.Question, {foreignKey: 'questionId'});
    }
  }
  GameProgress.init({
    status: DataTypes.STRING,
    allowNull: false
  }, {
    sequelize,
    modelName: 'GameProgress',
  });
  return GameProgress;
};