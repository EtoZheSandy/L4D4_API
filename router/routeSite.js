const express = require('express');
const router = express.Router();

const AnnonceMain = require('./routeSite/AnnonceMain');
const TwithStreams = require('./routeSite/TwithStreams');
const ServerInfo = require('./routeSite/ServerInfo');
const SteamWebAPI = require('./routeSite/SteamWebAPI');
const TopSelect = require('./routeSite/TopSelect');
const DonatePlayers = require('./routeSite/DonatePlayers');


// Добавляем все роуты в один роутер
router.use(AnnonceMain);
router.use(TwithStreams);
router.use(ServerInfo);
router.use(SteamWebAPI);
router.use(TopSelect);
router.use(DonatePlayers);


module.exports = router;