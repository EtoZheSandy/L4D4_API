const express = require('express');
const router = express.Router();

const AchievementTop = require('./routeTop/AchievementTop');
const TopAdmins = require('./routeTop/TopAdmins');

// Добавляем все роуты в один роутер
router.use(AchievementTop);
router.use(TopAdmins);

module.exports = router;