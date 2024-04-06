const express = require('express');
const axios = require('axios');
const pool = require('../../utils/mysqlServer');
const router = express.Router();
const routeCache = require('route-cache');
const { isValidSteamID } = require('../../utils/steamValidator');
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const { convertSteamID64ToSteamID } = require('../../utils/steamConverterID64');
const {GetAvatar} = require("../../utils/MongoCacheAvatar");

function isSteamProfileURL(input) {
    const steamProfileURLPattern = /^(https?:\/\/)?steamcommunity\.com\/(id\/[^/]+|profiles\/\d+)\/?$/;
    return steamProfileURLPattern.test(input);
}


async function resolveSteamIdFromUrl(steamProfileUrl) {
    console.log('steamProfileUrl = ' + steamProfileUrl)
    try {
        const response = await axios.get(
            `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${steamProfileUrl}`
        );

        if (response.data && response.data.response && response.data.response.success === 1 && response.data.response.steamid) {
            return response.data.response.steamid;
        } else {
            throw new Error('Не удалось разрешить Steam ID из URL.');
        }
    } catch (error) {
        console.error('Ошибка при запросе к Steam Community API:', error);
        throw error;
    }
}



async function searchBySteamIDOrNickname(nickname) {
    const connection = await pool.getConnection();
    try {
        let query1, query2;
        if (isValidSteamID(nickname)) {
            // Поиск по STEAM_ID в ScoreSystem
            query1 = `
                SELECT *
                FROM ScoreSystem
                WHERE STEAM_ID = ? LIMIT 10
            `;

            // Поиск по STEAM_ID в ScoreSystem_Admins
            query2 = `
                SELECT *
                FROM ScoreSystem_Admins
                WHERE STEAM_ID = ? LIMIT 10
            `;
        } else {
            // Поиск по нику в ScoreSystem
            query1 = `
                SELECT *
                FROM ScoreSystem
                WHERE Name LIKE ? LIMIT 10
            `;
            nickname = `%${nickname}%`;

            // Поиск по нику в ScoreSystem_Admins
            query2 = `
                SELECT *
                FROM ScoreSystem_Admins
                WHERE Name LIKE ? LIMIT 10
            `;
            nickname = `%${nickname}%`;
        }

        const [steamData1] = await connection.execute(query1, [nickname]);
        const [steamData2] = await connection.execute(query2, [nickname]);

        // Объединение результатов из обеих таблиц
        const combinedResult = [...steamData1, ...steamData2];

        console.log(combinedResult)
        for (const row of combinedResult) {
            // Для каждой записи, получите SteamID и выполните запрос к функции GetAvatar
            const steamID = row.STEAM_ID;
            const avatarInfo = await GetAvatar(steamID);

            console.log(avatarInfo)
            // Обновите поле Name и добавьте поле Avatar_url
            row.Name = avatarInfo[0].Name;
            row.Avatar_url = avatarInfo[0].Avatar_url;
        }

        console.log(combinedResult)
        return combinedResult;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


router.get('/v1/nickname/:nickname', routeCache.cacheSeconds(600), async (req, res) => {
    // console.log('поиск по нику')
    const nickname = req.params.nickname;

    if (isSteamProfileURL(nickname)) {
        const steamIdMatch = nickname.match(/\/(?:id|profiles)\/([^/]+)/);
        if (steamIdMatch && steamIdMatch[1]) {
            const steamId = steamIdMatch[1];
            console.log('Извлеченный Steam ID:', steamId);

            if (/^\d+$/.test(steamId)) {
                // Если steamId - чистый SteamID64, преобразуем его
                console.log('Полученный Steam ID (чистый SteamID64):', steamId);
                console.log(convertSteamID64ToSteamID(steamId));

                try {
                    const steamData = await searchBySteamIDOrNickname(convertSteamID64ToSteamID(steamId));
                    return res.json(steamData);
                } catch (error) {
                    return res.status(500).send('Ошибка выполнения запроса');
                }
            } else {
                try {
                    const resolvedSteamId = await resolveSteamIdFromUrl(steamId);
                    if (resolvedSteamId) {
                        console.log('Полученный Steam ID:', resolvedSteamId);
                        console.log(convertSteamID64ToSteamID(resolvedSteamId));

                        const steamData = await searchBySteamIDOrNickname(convertSteamID64ToSteamID(resolvedSteamId));
                        return res.json(steamData);
                    } else {
                        console.log('Не удалось получить Steam ID из URL.');
                        return res.status(400).json({ error: 'Не удалось получить Steam ID из URL.' });
                    }
                } catch (error) {
                    return res.status(500).send('Ошибка выполнения запроса');
                }
            }
        } else {
            console.log('Невозможно извлечь Steam ID из URL.');
            return res.status(400).json({ error: 'Неправильный формат Steam URL'});
        }
    } else if (nickname.length > 25 || nickname.length < 2) {
        return res.status(400).json({ error: 'Слишком длинный/короткий никнейм/SteamID' });
    } else {
        try {
            const steamData = await searchBySteamIDOrNickname(nickname);
            return res.json(steamData);
        } catch (error) {
            return res.status(500).send('Ошибка выполнения запроса');
        }
    }
});


module.exports = router;
