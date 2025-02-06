import express from "express";
import {Sequelize} from "sequelize";
import PlayerModel from "../../db/models/player.js";

const router = express.Router();

const sequelize = new Sequelize('svoyaigra','postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
});

const Player = PlayerModel(sequelize, Sequelize.DataTypes);

router.put("/game-progress", async (req, res) => {
    try {
        const { playerId, score, questionStatus} = req.body;
        console.log("Полученные данные", req.body)
        const player = await Player.findOne({ where: { id: playerId} });

        if (!player) {
            return res.status(404).json({ message: "Игрок не найден" });
        }
        player.score = score;
        player.questionStatus = {
            ...(player.questionStatus || {}),
            ...questionStatus
        };
        await player.save();
        return res.json({ message: "Счет обновлен", player });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

export default router;