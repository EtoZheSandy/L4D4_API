const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); // загрузка .env файла
const allowSite = process.env.ALLOW_SITE;

const app = express();
const port = 3090;
const host = '0.0.0.0';

// Разрешить запросы только с определенных адресов и доменов
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3090', 'http://localhost:3000', allowSite];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));


// Удалить заголовок X-Powered-By
app.disable('x-powered-by');

// Включите настройку 'trust proxy'
app.set('trust proxy', true);

// Configuring body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Ограничение на 60 запросов в минуту
const limiter = rateLimit({
    windowMs: 60 * 1000, // 2 минута
    max: 1500, // Максимальное количество запросов
});
app.use(limiter);

const routeUser = require('./router/routeUser')
app.use(routeUser)

const routeCup = require('./router/routeCup')
app.use(routeCup)

const routeOnline = require('./router/routeOnline')
app.use(routeOnline)

const routeTop = require('./router/routeTop')
app.use(routeTop)

const routeSite = require('./router/routeSite')
app.use(routeSite)


app.listen(port, host, () => console.log(`${host}:${port}!`))
