const express = require('express');
const router = express.Router();
const routeCache = require('route-cache');
const axios = require('axios');
const cheerio = require('cheerio');

router.get('/v1/steam_group', routeCache.cacheSeconds(300), async (req, res) => {
    // URL Steam-группы
    const steamGroupURL = 'https://steamcommunity.com/groups/Endurance_l4d2';
    try {
        const response = await axios.get(steamGroupURL);
        const html = response.data;

        // Используем Cheerio для парсинга HTML
        const $ = cheerio.load(html);

        // для УЧАСТНИКИ
        // Найдем нужный элемент <span class="count">
        const countElement = $('.responsive_group_stats .membercount.members .count');
        // Получим данные из элемента <span class="count"> и уберем лишние пробелы
        const members = countElement.text().trim();

        // для В ИГРЕ
        const countElementinGame = $('.responsive_group_stats .membercount.ingame .count');
        // Получим данные из элемента <span class="count"> и уберем лишние пробелы
        const inGame = countElementinGame.text().trim();
        // для В СЕТИ
        const countElementonline = $('.responsive_group_stats .membercount.online .count');
        // Получим данные из элемента <span class="count"> и уберем лишние пробелы
        const online = countElementonline.text().trim();
        // console.log('УЧАСТНИКИ:', members);
        // console.log('В ИГРЕ:', inGame);
        // console.log('В СЕТИ:', online);


        res.json({members: members, inGame: inGame, online: online});
    } catch (error) {
        console.error('Error cheerio query:', error);
        res.status(500).send('Ошибка выполнения запроса');
    }
})

module.exports = router;