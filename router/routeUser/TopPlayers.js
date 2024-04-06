const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require('route-cache');
const { GetAvatar } = require('../../utils/MongoCacheAvatar');

router.get('/v1/top_users/:start/:limit', routeCache.cacheSeconds(60), async (req, res) => {
    const start = parseInt(req.params.start, 10) || 0; // Начальная запись (по умолчанию 0)
    const limit = parseInt(req.params.limit, 10) || 15; // Количество записей (по умолчанию 10)

    if (isNaN(start) || isNaN(limit) || start < 0 || limit <= 0 || start > 1000 || limit > 1000) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();
        const [rows, _] = await connection.query('SELECT * FROM ScoreSystem ORDER BY TotalScore DESC LIMIT ?, ?', [start, limit]);

        for (const row of rows) {
            // Для каждой записи, получите SteamID и выполните запрос к функции GetAvatar
            const steamID = row.STEAM_ID;
            const avatarInfo = await GetAvatar(steamID);

            // Обновите поле Name и добавьте поле Avatar_url
            row.Name = avatarInfo[0].Name;
            row.Avatar_url = avatarInfo[0].Avatar_url;
        }

        res.json(rows);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Ошибка выполнения запроса');
    } finally {
        if (connection) {
            connection.release(); // Возвращаем соединение обратно в пул
        }
    }
})

module.exports = router;
