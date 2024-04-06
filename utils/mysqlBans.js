const mysql = require('mysql2/promise');

const user = process.env.DB_BANS_USER;
const password = process.env.DB_BANS_PASSWORD;
const domain = process.env.DOMAIN_DB;

// Создайте подключение к базе данных MySQL
const poolBan = mysql.createPool({
    host: domain,
    user: user,
    password: password,
    database: 'SourceBans_MaterialAdmin',
    connectionLimit: 25
});

// Экспортируйте пул соединений для использования в других файлах
module.exports = poolBan;