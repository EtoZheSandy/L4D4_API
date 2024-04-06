const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const {isValidSteamID} = require('../../utils/steamValidator');
const routeCache = require("route-cache");

router.get('/v1/elite_users/:steamid', routeCache.cacheSeconds(300), async (req, res) => {
    const steamID = req.params.steamid;
    //валидация steam id
    if (!isValidSteamID(steamID)) {
        return res.status(400).json({error: 'Invalid SteamID'});
    }
    // дата сейчас - 6 месяцев
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Проверяем наличие игрока в таблице ScoreSystem_All
        const [scoreSystemRows, _] = await connection.execute('SELECT * FROM ScoreSystem_All WHERE STEAM_ID = ? AND rang <= 1000 AND STR_TO_DATE(Season, "%d.%m.%Y") >= ?', [steamID, sixMonthsAgo]);

        // Проверяем наличие игрока в таблице Endurance_Privileges
        const [privilegesRows, __] = await connection.execute('SELECT * FROM Endurance_Privileges WHERE STEAM_ID = ? AND UnixTime_Until > UNIX_TIMESTAMP(NOW())', [steamID]);

        const response = {
            Privileges: privilegesRows.length > 0,
            ScoreSystem: scoreSystemRows.length > 0
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

