import express from 'express';

export default function createPlayerRouter({ Player }) {
  const router = express.Router();

  router.put('/game-progress', async (req, res) => {
    try {
      const { playerId, score, questionStatus } = req.body;
      const player = await Player.findOne({ where: { id: playerId } });

      if (!player) {
        return res.status(404).json({ message: 'Игрок не найден' });
      }

      player.score = score;
      player.questionStatus = {
        ...(player.questionStatus || {}),
        ...questionStatus,
      };

      await player.save();
      return res.json({ message: 'Счет обновлен', player });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  return router;
}
