const express = require('express');
const pool = require('../../utils/mysqlModer');
const router = express.Router();
const routeCache = require('route-cache');

router.get('/v1/annonce', routeCache.cacheSeconds(60), async (req, res) => {
    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally

    const DateEnd = new Date();
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute('SELECT * FROM L4D4_Annonce WHERE DateEnd > ? AND View = 1', [DateEnd]);

        const Message = rows.map(row => row);

        res.json(Message);
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