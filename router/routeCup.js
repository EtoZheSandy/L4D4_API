const express = require('express');
const router = express.Router();

const CupCommands = require('./routeCup/CupCommands');
const CupTimig = require('./routeCup/CupTimig');
const DiscordBet = require('./routeCup/DiscordBet');

// Добавляем все роуты в один роутер
router.use(CupCommands);
router.use(CupTimig);
router.use(DiscordBet);

module.exports = router;