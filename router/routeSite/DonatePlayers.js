const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require('route-cache');

router.get('/v1/donate_players', routeCache.cacheSeconds(300), async (req, res) => {
    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        const currentTimeUnix = Math.floor(Date.now() / 1000); // Текущее время в формате Unix
        const [rows] = await connection.execute('SELECT STEAM_ID, FLAGS, UnixTime_Until FROM Endurance_Privileges WHERE UnixTime_Until = -1 OR UnixTime_Until > ?', [currentTimeUnix]);

        const donateusers = rows.map(row => ({
            STEAM_ID: row.STEAM_ID,
            FLAGS: row.FLAGS,
            UnixTime_Until: row.UnixTime_Until
        }));

        res.json(donateusers);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Ошибка выполнения запроса');
    } finally {
        connection.release(); // Возвращаем соединение обратно в пул
    }
})

module.exports = router;