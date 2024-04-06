const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require('route-cache');

router.get('/v1/online_day', routeCache.cacheSeconds(300), async (req, res) => {
    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();
        const currentTime = new Date();
        const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000);

        // Запрос для подсчета новых и старых игроков в одном запросе
        const [rows] = await connection.execute(`
                SELECT 'new' AS player_type, COUNT(*) AS count
                FROM Endurance_Points
                WHERE date_added >= ? AND date_added <= ?
                UNION ALL
                SELECT 'old' AS player_type, COUNT(*) AS count
                FROM ScoreSystem
                WHERE LastConnectionTime >= ? AND LastConnectionTime <= ?
              `, [twentyFourHoursAgo, currentTime, twentyFourHoursAgo, currentTime]);

        // Общее количество игроков
        const totalPlayerCount = rows.reduce((total, row) => total + row.count, 0);

        // console.log(`Общее количество игроков: ${totalPlayerCount}`);

        // запрос не верный он должен просто возвращать из таблицы last connect
        // а возвращает еще и новичков
        res.json(totalPlayerCount);
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