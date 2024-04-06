const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const {isValidSteamID} = require('../../utils/steamValidator');
const routeCache = require("route-cache");

router.get('/v1/privileges/:steamid', routeCache.cacheSeconds(60), async (req, res) => {
    const steamID = req.params.steamid;
    //валидация steam id
    if (!isValidSteamID(steamID)) {
        return res.status(400).json({error: 'Invalid SteamID'});
    }

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Проверяем наличие игрока в таблице Endurance_Privileges
        const [privilegesRows, __] = await connection.execute('SELECT * FROM Endurance_Privileges WHERE STEAM_ID = ? AND (UnixTime_Until = -1 OR UnixTime_Until > UNIX_TIMESTAMP(NOW()))', [steamID]);

        // TODO Проверяем наличие игрока в таблице admins

        const response = {
            Privileges: privilegesRows.length > 0
                ? privilegesRows.map(row => ({ FLAGS: row.FLAGS, UnixTime_Until: row.UnixTime_Until }))
                : false
        };

        res.json(response);
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

