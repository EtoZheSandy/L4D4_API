const express = require('express');
const pool = require('../../utils/mysqlDiscord'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require("route-cache");

router.get('/v1/discrodbet', routeCache.cacheSeconds(30), async (req, res) => {
    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Проверяем наличие игрока в таблице Endurance_Privileges
        const [sum_command] = await connection.query('SELECT cc.ID, cc.Name_Command, cc.emoji, cc.score, SUM(cb.Coins) AS TotalCoins FROM cup_Commands cc JOIN cup_bet cb ON cc.ID = cb.ID_Command GROUP BY cc.ID, cc.Name_Command, cc.emoji, cc.score ORDER BY TotalCoins DESC');

        res.json(sum_command);
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

