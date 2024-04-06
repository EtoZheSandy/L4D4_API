const express = require('express');
const router = express.Router();

const OnlineDay = require('./routeOnline/OnlineDay');
const OnlinePlayers = require('./routeOnline/OnlinePlayers');
const SteamGroupGames = require('./routeOnline/SteamGroupGames');
const AllPlayers = require('./routeOnline/AllPlayers');

// Добавляем все роуты в один роутер
router.use(OnlineDay);
router.use(OnlinePlayers);
router.use(SteamGroupGames);
router.use(AllPlayers);

module.exports = router;