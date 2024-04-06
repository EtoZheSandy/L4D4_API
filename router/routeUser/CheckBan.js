const express = require('express');
const pool = require('../../utils/mysqlBans'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require('route-cache');
const {isValidSteamID} = require("../../utils/steamValidator");

router.get('/v1/bans/:steamid', routeCache.cacheSeconds(60), async (req, res) => {

    const steamID = req.params.steamid;
    // валидация steam id
    if (!isValidSteamID(steamID)) {
        return res.status(400).json({ error: 'Invalid SteamID' });
    }

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        const currentTimeUnix = Math.floor(Date.now() / 1000); // Текущее время в формате Unix
        const [playerBan] = await connection.execute('SELECT ends, length, reason\n' +
            'FROM sb_bans\n' +
            'WHERE (length = 0 OR ends > ?) AND authid = ? AND RemovedBy IS NULL\n' +
            'ORDER BY bid DESC LIMIT 1', [currentTimeUnix, steamID]);

        return res.json(playerBan);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).send('Ошибка выполнения запроса');
    } finally {
        if (connection) {
            connection.release(); // Возвращаем соединение обратно в пул
        }
    }
})

module.exports = router;
