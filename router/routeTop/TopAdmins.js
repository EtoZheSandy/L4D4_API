const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require('route-cache');
const {GetAvatar} = require("../../utils/MongoCacheAvatar");

router.get('/v1/top_admins', routeCache.cacheSeconds(60), async (req, res) => {

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();
        const [rows, _] = await connection.query('SELECT * FROM ScoreSystem_Admins ORDER BY TotalScore DESC');

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
