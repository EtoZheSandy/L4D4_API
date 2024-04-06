const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const {isValidSteamID} = require('../../utils/steamValidator');
const routeCache = require("route-cache");

router.get('/v1/achievement/:steamid', routeCache.cacheSeconds(6000), async (req, res) => {
    const steamID = req.params.steamid;
    //валидация steam id
    if (!isValidSteamID(steamID)) {
        return res.status(400).json({error: 'Invalid SteamID'});
    }

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Проверяем наличие игрока в таблице Endurance_Privileges
        const [topsto] = await connection.execute('SELECT STEAM_ID, COUNT(*) AS CountRanksAbove100 FROM ScoreSystem_All WHERE STEAM_ID = ? AND rang <= 100 GROUP BY STEAM_ID', [steamID]);

        // Проверяем длину результата
        if (topsto.length === 0) {
            // Если результат пуст, создаем массив с нужной структурой и возвращаем его
            const emptyResult = [{"STEAM_ID": steamID, "CountRanksAbove100": 0}];
            res.json(emptyResult);
        } else {
            // Если результат не пуст, возвращаем его как есть
            res.json(topsto);
        }
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

