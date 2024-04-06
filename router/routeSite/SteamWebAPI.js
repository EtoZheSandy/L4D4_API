const express = require('express');
const router = express.Router();
const routeCache = require('route-cache');
const {isValidSteamID} = require("../../utils/steamValidator");
const {convertSteamIDToSteamID64} = require("../../utils/steamConverter");
const axios = require('axios'); // Импортируем библиотеку axios

const STEAM_API_KEY = process.env.STEAM_API_KEY; // Замените на ваш ключ API Steam
router.get('/v1/get_steam/:steamid', routeCache.cacheSeconds(57600), async (req, res) => {
    const steamID = req.params.steamid;

    //blacklist
    if (steamID === 'STEAM_1:1:24771971') {
        return res.status(500).send('Ошибка при запросе данных');
    }

    // валидация steam id
    if (!isValidSteamID(steamID)) {
        return res.status(400).json({ error: 'Invalid SteamID' });
    }
    try {
        // Преобразуем SteamID в SteamID64
        const steamID64 = convertSteamIDToSteamID64(steamID);

        // Создаем URL для запроса к API Steam
        const steamApiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamID64}`;

        // Выполняем запрос к API Steam
        const response = await axios.get(steamApiUrl);

        // Проверяем, получены ли данные успешно
        if (response.status === 200) {
            // В ответе содержится информация о пользователе
            const playerInfo = response.data.response.players[0];
            return res.json(playerInfo);
        } else {
            return res.status(500).send('Ошибка при запросе данных Steam API');
        }
    } catch (error) {
        console.error('Error executing STEAM API query:', error);
        return res.status(500).send('Ошибка выполнения запроса');
    }
})

module.exports = router;



