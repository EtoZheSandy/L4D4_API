const { MongoClient } = require('mongodb');

const mongoURI = process.env.MONGO_URI;

const options = {
    maxPoolSize: 20,
};

const client = new MongoClient(mongoURI, options);

function getClient() {
    return client;
}

module.exports = {
    getClient, // Добавляем функцию для получения клиента
};
