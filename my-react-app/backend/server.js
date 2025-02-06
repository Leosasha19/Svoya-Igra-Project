import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {DataTypes, QueryTypes, Sequelize} from "sequelize";
import PlayerModel from "../db/models/player.js";
import updateScoreRouter from "./routes/PlayerRoutes.js";
import gameProgressRouter from "./routes/gameProgressRoutes.js";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());
app.use(express.json())
app.use("/api", updateScoreRouter);
app.use("/api", gameProgressRouter)


const sequelize = new Sequelize('svoyaigra','postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize
    .authenticate()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Unable to connect to PostgreSQL:', err))

sequelize.sync({ force: false })
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error during synchronization:', err));

const Player = PlayerModel(sequelize, Sequelize.DataTypes);

app.post('/api/players', async (req, res) => {
    try {
        const { name, score } = req.body;
        if(!name) {
            return res.status(400).json({ error: "Имя обязательно" });
        }
        const existingPlayer = await Player.findOne({ where: { name } });
        if(existingPlayer) {
            return res.status(200).json({
                message: "Игрок найден",
                player: existingPlayer
            })
        }
        const newUser = await Player.create({ name, score });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Ошибка сохранения пользователя:', error.message);
        console.error('Full error details:', error);
        res.status(500).json({ error: 'Ошибка при сохранении' });
    }
})

// app.put("/api/game-progress", async (req, res) => {
//     try {
//         const { playerId, score, completedQuestions } = req.body;
//         const player = await Player.findOne({where: {id: playerId}})
//         if (!player) {
//             return res.status(404).json({ message: "Игрок не найден" });
//         }
//         player.score = score;
//         console.log("СОХРАНЯЕМЫЙ РЕЗУЛЬТАТ", player.score)
//         player.completedQuestions = completedQuestions;
//         await player.save();
//         return res.json({ message: "Прогресс сохранен", player });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Ошибка при сохранении прогресса" });
//     }
// })

app.get('/game', async (req, res) => {
    try {
        const questions = await sequelize.query('SELECT * FROM "Questions"', {
            type: Sequelize.QueryTypes.SELECT,
        });
        res.json(questions);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to fetch players' });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})