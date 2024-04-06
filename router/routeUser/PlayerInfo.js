const express = require('express');
const pool = require('../../utils/mysqlServer'); // Подключаем пул соединений
const router = express.Router();
const routeCache = require('route-cache');
const {isValidSteamID} = require("../../utils/steamValidator");

router.get('/v1/player_info/:steamid', routeCache.cacheSeconds(60), async (req, res) => {

    const steamID = req.params.steamid;
    // валидация steam id
    if (!isValidSteamID(steamID)) {
        return res.status(400).json({ error: 'Invalid SteamID' });
    }

    let connection; // Объявляем переменную connection здесь, чтобы она была видна в блоке finally
    try {
        connection = await pool.getConnection();

        // Запрос для получения информации о игроке по STEAM_ID и его места в таблице по TotalScore
        const [scoreSystemRows] = await connection.execute(`
              SELECT TotalScore, GameTime, LastConnectionTime,
                     (SELECT COUNT(*) + 1 FROM ScoreSystem WHERE TotalScore > s.TotalScore) AS PlayerRank
              FROM ScoreSystem s
              WHERE STEAM_ID = ?
            `, [steamID]);

        // if (scoreSystemRows.length === 0) {
        //     return res.json(null); // Если игрок с данным STEAM_ID не найден
        // }

        // Запрос для получения информации из таблицы Endurance_Points по STEAM_ID и date_added
        const [endurancePointsRows] = await connection.execute(`
            SELECT
                date_added
            FROM Endurance_Points
            WHERE steamID = ?
        `, [steamID]); // Замените 'your_date_added' на нужное значение date_added

        const [privilegesRows] = await connection.query(`
            SELECT 
                * 
                FROM Endurance_Privileges 
                WHERE STEAM_ID = ? AND (UnixTime_Until = -1 OR UnixTime_Until > UNIX_TIMESTAMP(NOW()))`, [steamID]);

        console.log(privilegesRows)
        const playerInfo = {
            // SteamID: steamID,
            TotalScore: scoreSystemRows.length > 0 ? scoreSystemRows[0].TotalScore : null,
            GameTime: scoreSystemRows.length > 0 ? scoreSystemRows[0].GameTime : null,
            LastConnectionTime: scoreSystemRows.length > 0 ? scoreSystemRows[0].LastConnectionTime : null,
            PlayerRank: scoreSystemRows.length > 0 ? scoreSystemRows[0].PlayerRank : null,
            DateAdded: endurancePointsRows.length > 0 ? endurancePointsRows[0].date_added : null,
            Privileges: privilegesRows.length > 0 ? privilegesRows[0].FLAGS : null
        };

        return res.json(playerInfo);
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
