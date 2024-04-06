const express = require('express');
const pool = require('../../utils/mysqlBans'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require('route-cache');

router.get('/v1/admins_players', routeCache.cacheSeconds(600), async (req, res) => {
    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query('SELECT authid FROM sb_admins WHERE aid > 0 AND srv_flags IS NOT NULL ORDER BY aid');

        const admins = rows.map(row => row.authid);

        res.json(admins);
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