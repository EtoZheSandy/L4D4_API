const express = require('express');
const router = express.Router();
const routeCache = require('route-cache');
const mongodb = require('../../utils/mongodb'); // Подключаем mongo


router.get('/v1/server/:serverid', routeCache.cacheSeconds(10), async (req, res) => {
    const serverId = req.params.serverid; // Получаем serverid из параметра запроса

    if (isNaN(serverId) || serverId < 0 || serverId > 100) {
        return res.status(400).json({error: 'Invalid parameters'});
    }

    try {
        const client = mongodb.getClient(); // Получаем клиента MongoDB
        const db = client.db('l4d4_monitoring'); // Используем клиент для получения базы данных

        // const db = await mongodb.connectToMongo();
        let filter = {}; // Создаем фильтр для запроса

        if (serverId === '0') {
            // Если serverid равен '0', фильтрация не требуется, вернем все серверы
            const latestServerData = await db
                .collection('serverData')
                .aggregate([
                    {
                        $group: {
                            _id: '$serverId', // Группировка по идентификатору сервера
                            latestData: {$last: '$$ROOT'}, // Выбор последних данных
                        },
                    },
                    {
                        $replaceRoot: {newRoot: '$latestData'}, // Замена корневого документа на последние данные
                    },
                    {
                        $project: {
                            _id: 0, // Указываем, что поле _id не должно включаться в результаты
                            ping: 0, // Исключаем поле ping
                        },
                    },
                ])
                .toArray();

            res.json(latestServerData);
        } else if (!isNaN(parseInt(serverId))) {
            // Если передан конкретный serverid, фильтруем по нему
            filter.serverId = parseInt(serverId);

            const serverData = await db
                .collection('serverData')
                .aggregate([
                    {
                        $match: {serverId: parseInt(serverId)} // Фильтруем по serverId
                    },
                    {
                        $sort: {timestamp: -1} // Сортируем по времени в убывающем порядке
                    },
                    {
                        $limit: 1 // Ограничиваем результат одной записью (последней)
                    },
                    {
                        $project: {_id: 0, ping: 0} // Исключаем поля _id и ping
                    }
                ])
                .toArray();

            res.json(serverData);
        } else {
            // Некорректное значение serverid, вернем ошибку
            return res.status(400).json({error: 'Invalid serverid'});
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;
