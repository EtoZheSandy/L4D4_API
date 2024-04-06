const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require("route-cache");
const {isValidSteamID} = require("../../utils/steamValidator");

router.get('/v1/alltimescore/:steamid', routeCache.cacheSeconds(6000), async (req, res) => {

    const steamID = req.params.steamid;
    // валидация steam id
    if (!isValidSteamID(steamID)) {
        return res.status(400).json({ error: 'Invalid SteamID' });
    }

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Проверяем наличие игрока в таблице Endurance_Privileges
        const [PlayerAllTimeScore] = await connection.query('SELECT SUM(TotalScore) AS totalScoreSum, SUM(GameTime) AS gameTimeSum FROM ScoreSystem_All WHERE STEAM_ID = ?',
            [steamID]);

        res.json(PlayerAllTimeScore);
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

