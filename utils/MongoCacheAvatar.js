const mongodb = require("./mongodb");
const axios = require('axios');
const {convertSteamIDToSteamID64} = require("./steamConverter"); // Импортируем библиотеку axios

const STEAM_API_KEY = process.env.STEAM_API_KEY ; // Замените на ваш ключ API Steam

async function GetAvatar(steam_id) {
    //запрос к mongo
    try {
        const client = mongodb.getClient(); // Получаем клиента MongoDB
        const db = client.db('l4d4_monitoring'); // Используем клиент для получения базы данных

        const sevenDaysAgo = new Date(); // Вычисляем дату, представляющую "7 дней назад"
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        // Поиск пользователя в базе данных
        const userData = await db
            .collection('userSteam')
            .find({
                steamID: steam_id,
                timestamp: { $gte: sevenDaysAgo }
            })
            .sort({ timestamp: -1 })
            .limit(1)
            .project({ _id: 0 })
            .toArray();

        if (userData.length === 0) {
            // Если пользователь не найден, обратитесь к функции GetSteamApiAvatar
            return await GetSteamApiAvatar(steam_id);
        } else {
            return userData;
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

//запрашиваю со стим апи юзера
async function GetSteamApiAvatar(steamID) {
    try {
        const steamID64 = convertSteamIDToSteamID64(steamID); // Преобразуем SteamID в SteamID64
        // Создаем URL для запроса к API Steam
        const steamApiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamID64}`;
        const response = await axios.get(steamApiUrl); // Выполняем запрос к API Steam

        // Проверяем, получены ли данные успешно
        if (response.status === 200) {
            const playerInfo = response.data.response.players[0]; // В ответе содержится информация о пользователе
            // Создаем новый объект с выбранными полями
            const UserData = {
                steamID: steamID,
                Name: playerInfo.personaname,
                Avatar_url: playerInfo.avatarmedium,
                timestamp: new Date(), // Добавьте поле с временной меткой
            };
            await SaveUserDataToMongo(UserData); // Сохраняем полученные данные в MongoDB
            return [{ steamID: steamID, Name: playerInfo.personaname, Avatar_url: playerInfo.avatarmedium }]
        } else {
            // Создаем новый объект с выбранными полями
            const UserData = {
                steamID: steamID,
                Name: 'None',
                Avatar_url: 'https://avatars.cloudflare.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
                timestamp: new Date(), // Добавьте поле с временной меткой
            };
            // Сохраните полученные данные в MongoDB
            await SaveUserDataToMongo(UserData);
            return { steamID: steamID, Name: 'None', Avatar_url: 'https://avatars.cloudflare.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' }
        }
    } catch (error) {
        console.error('Error executing STEAM API query:', error);
    }
}

async function SaveUserDataToMongo(userData) {
    try {
        const client = mongodb.getClient();
        const db = client.db('l4d4_monitoring');
        await db.collection('userSteam').insertOne(userData);
    } catch (error) {
        console.error(`Error saving user data to MongoDB: ${error.message}`);
        throw error;
    }
}

// Пример использования:
module.exports = {
    GetAvatar
};