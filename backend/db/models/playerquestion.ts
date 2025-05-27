'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayerQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Player, {foreignKey: 'playerId', as: 'player'});
      this.belongsTo(models.Question, {foreignKey: 'questionId', as: 'question'});
    }
  }
  PlayerQuestion.init({
    playerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Players',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    questionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Questions',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    answered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'PlayerQuestion',
  });
  return PlayerQuestion;
};