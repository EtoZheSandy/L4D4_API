const express = require('express');
const axios = require('axios');
const routeCache = require("route-cache");
const router = express.Router();
const clientId = process.env.CLIENT_ID;
const oauthToken = process.env.oauthToken;

router.get('/v1/streams/left4dead2', routeCache.cacheSeconds(60), async (req, res) => {
    try {
        // curl -X POST "https://id.twitch.tv/oauth2/token?client_id=SECRET_TOKEN_CLIENT_ID&client_secret=SECRET_oauthToken&grant_type=client_credentials"

        const response = await axios.get('https://api.twitch.tv/helix/streams?game_id=24193&language=ru', {
            headers: {
                'Client-ID': clientId, // Client ID Twitch API
                'Authorization': `Bearer ${oauthToken}`
            }
        });

        if (response.status === 200) {
            const streamData = response.data.data.map(stream => ({
                id: stream.id,
                userName: stream.user_name,
                title: stream.title,
                viewerCount: stream.viewer_count,
                thumbnailUrl: stream.thumbnail_url,
                streamLink: `https://www.twitch.tv/${stream.user_name}`
            }));

            // Отправляем массив данных о стримах в ответе
            res.json(streamData);
        } else {
            res.status(response.status).json({ error: 'Ошибка при запросе к Twitch API' });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router;
