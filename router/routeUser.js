const express = require('express');
const router = express.Router();

const TopPlayers = require('./routeUser/TopPlayers');
const ElitePlayers = require('./routeUser/ElitePlayers');
const CheckBan = require('./routeUser/CheckBan');
const AchievementPlayer = require('./routeUser/AchievementPlayer');
const AllTimeScore = require('./routeUser/AllTimeScore');
const PlayerInfo = require('./routeUser/PlayerInfo');
const OldSeason = require('./routeUser/OldSeason');
const Privileges = require('./routeUser/Privileges');
const AdminsPlayers = require('./routeUser/AdminsPlayers');

// Добавляем все роуты в один роутер
router.use(TopPlayers);
router.use(ElitePlayers);
router.use(CheckBan);
router.use(AchievementPlayer);
router.use(AllTimeScore);
router.use(PlayerInfo);
router.use(OldSeason);
router.use(Privileges);
router.use(AdminsPlayers);

module.exports = router;