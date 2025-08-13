import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Sequelize } from 'sequelize';
import PlayerModel from './db/models/player.js';
import GameProgressModel from './db/models/gameprogress.js';
import updateScoreRouter from './routes/PlayerRoutes.js';
import gameProgressRouter from './routes/gameProgressRoutes.js';

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://svoya-igra-project-1.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', updateScoreRouter);
app.use('/api', gameProgressRouter);


const sequelize = new Sequelize(process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
  });

sequelize
  .authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Unable to connect to PostgreSQL:', err));

const Player = PlayerModel(sequelize, Sequelize.DataTypes);
const GameProgress = GameProgressModel(sequelize, Sequelize.DataTypes);

GameProgress.belongsTo(Player, { foreignKey: 'userId' });

sequelize.sync({ force: false })
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Error during synchronization:', err));

app.post('/api/players', async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Имя обязательно' });
    }
    let player = await Player.findOne({ where: { name } });
    if (!player) {
      player = await Player.create({ name, score });
      return res.status(201).json({
        message: 'Игрок создан',
        player,
      });
    }
    res.status(200).json({
      message: 'Игрок найден',
      player,
    });
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error.message);
    console.error('Full error details:', error);
    res.status(500).json({ error: 'Ошибка при сохранении' });
  }
});

app.get('/game', async (req, res) => {
  try {
    const questions = await sequelize.query('SELECT * FROM "Questions"', {
      type: Sequelize.QueryTypes.SELECT,
    });
    res.json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});