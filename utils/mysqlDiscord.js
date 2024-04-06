const mysqlServer = require('mysql2/promise');

const user = process.env.DB_DISCORD_USER;
const password = process.env.DB_DISCORD_PASSWORD;
const domain = process.env.DOMAIN_DB;

// Создайте подключение к базе данных MySQL
const pool = mysqlServer.createPool({
    host: domain,
    user: user,
    password: password,
    database: 'discord',
    connectionLimit: 15
});

// Экспортируйте пул соединений для использования в других файлах
module.exports = pool;