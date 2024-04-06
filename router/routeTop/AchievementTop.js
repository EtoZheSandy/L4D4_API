const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require("route-cache");

router.get('/v1/achievement_top', routeCache.cacheSeconds(6000), async (req, res) => {
    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Проверяем наличие игрока в таблице Endurance_Privileges
        const [topachiv] = await connection.query('SELECT STEAM_ID, COUNT(*) AS CountRanksAbove100 FROM ScoreSystem_All WHERE rang <= 100 GROUP BY STEAM_ID ORDER BY CountRanksAbove100 DESC LIMIT 50');

        res.json(topachiv);
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

