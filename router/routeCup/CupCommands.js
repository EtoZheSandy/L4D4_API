const express = require('express');
const pool = require('../../utils/mysqlDiscord'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require("route-cache");

router.get('/v1/cupcomand', routeCache.cacheSeconds(30), async (req, res) => {
    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Проверяем наличие игрока в таблице Endurance_Privileges
        const [cup_Commands] = await connection.query('SELECT * FROM cup_Commands');

        res.json(cup_Commands);
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

