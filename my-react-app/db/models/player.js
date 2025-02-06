import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      this.hasMany(models.PlayerQuestion, { foreignKey: "playerId", as: "playerQuestions" });
    }
  }

  Player.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        score: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
          completedQuestions: {
              type: DataTypes.JSONB,  // Если это список вопросов
              defaultValue: [],
          },
          questionStatus: {
              type: DataTypes.JSONB,
              allowNull: true,
              defaultValue: {},
          },
      },
      {
        sequelize,
        modelName: "Player",
        timestamps: true,
      }
  );

  return Player;
};
