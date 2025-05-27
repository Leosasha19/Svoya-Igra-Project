import express from "express";
import PlayerModel from "../db/models/player.js";
import {Sequelize} from "sequelize";

const router = express.Router();


const sequelize = new Sequelize('svoyaigra','postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
});

const Player = PlayerModel(sequelize, Sequelize.DataTypes);

router.get("/game-progress/:playerId", async (req, res) => {

    try {
        const playerId = Number(req.params.playerId);
        const player = await Player.findOne({where: {id: playerId}});
        if (!player) {
            return res.status(404).json({message: "Player not found"});
        }
        return res.json({message:"Прогресс загружен", player})
    } catch (error) {
        console.error("Ошибка при получении прогресса:", error.message);
        res.status(500).json({ message: "Ошибка при получении прогресса" });
    }
})

export default router;