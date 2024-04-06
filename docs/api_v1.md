# Endurance API – v1.0.7

> ⚠️
> Это первая редакция документации по API
> 
> **Со временем будет изменен роутинг с api2 на api
> как только будет дописан весь сайт**

> ⚠️ Все запросы кэшируются от 10 до N секунд!

> ⚠️ Все запросы имеют лимиты на частоту обращения, сейчас установлен лимит не более **700 запросов в минуту** от клиента, но все может поменятся 

- [**RestAPI**](#restapi) – *Документация по RestAPI*

## RestAPI
```
https://api2.l4d4.com/v1/
```

# Список методов:

## Открытые методы

- [**GET admins_players**](#-admins_players) - *Получить **список** администраторов*
- [**GET donate_players**](#-donate_players) - *Получить **массив** привилегированных игроков*
- [**GET oldseason**](#-oldseason) - Список последних сезонов игрока
- [**GET online_day**](#-online_day) - Онлайн за 24 часа
- [**GET player_info**](#-player_info) - Информация об игроке
- [**GET server**](#-server) - Онлайн сервера
- [**GET steam_group**](#-steam_group) - Информация о стим группе
- [**GET get_steam**](#-get_steam) - Парсинг информации об игроке со Steam API
- [**GET top_admins**](#-top_admins) - Топ админов
- [**GET nickname**](#-nickname) - поиск по нику/steamid
- [**GET top_users**](#-top_users) – *Получить информацию о топе игроков*
- [**GET elite_users**](#-elite_users) – Проверка активной привилегии и членство в топ 1000 за пол года
- [**GET privileges**](#-privileges) – *Получить привилегию игрока*
- [**GET streams**](#-streams) - Получить стримы по l4d2 с twitch
- [**GET achievement**](#-achievement) - Количество попаданий в топ 100 сезона
- [**GET achievement_top**](#-achievement_top) - Топ 50 игроков попавших max раз в топ 100 сезона
- [**GET allplayers**](#-allplayers) - Возвращает количество игроков из базы данных
- [**GET alltimescore**](#-alltimescore) - Общее количество проведенного на проекте времени и очков
- [**GET annonce**](#-annonce) - Возвращает свежие объявления для показа на сайте
- [**GET bans**](#-bans) - Проверяет есть ли активный бан у игрок 
- [**GET online_players**](#-online_players) - Показывает *всех* активных игроков на серверах и информацию о них



## Пользовательские методы, требующие авторизации
- [**GET user**](#-topUsers) – *Получить информацию об аккаунте пользователя*


# Описание методов: 


## • admins_players
Получить список STEAM_ID администраторов

```js
GET /v1/admins_players
```
### Пример ответа
```json
["STEAM_1:1:93404934","STEAM_1:0:82962447","STEAM_1:0:70091580"]
```

## • donate_players
Получить массив с **активными** привилегированными игроками 
```js
GET /v1/donate_players
```
### Пример ответа
```json
[
  {"STEAM_ID":"STEAM_1:0:112569165","FLAGS":"q","UnixTime_Until":2000000000},
  {"STEAM_ID":"STEAM_1:0:144066445","FLAGS":"p","UnixTime_Until":1695478232}
]
```

## • oldseason
Список всех сезонов игрока
```js
GET /v1/oldseason/:steamid
```
### Пример ответа
```json
[
  {"Season":"13.6.2021","rang":6028,"TotalScore":-153,"GameTime":340},
  {"Season":"13.7.2022","rang":21,"TotalScore":349489,"GameTime":90093},
  {"Season":"13.6.2022","rang":152,"TotalScore":69683,"GameTime":17818}
]
```

## • online_day
Онлайн серверов за 24 часа
```js
GET /v1/online_day
```

## • player_info
Получить подробную информацию об игроке
```js
GET /v1/player_info/:steamid
```
### Пример ответа
```json
{"TotalScore":219520,"GameTime":44859,"LastConnectionTime":"2023-09-19T22:15:59.000Z","PlayerRank":12,"DateAdded":"2021-11-11T21:07:15.000Z","Privileges":"q"}
```

## • server
Получить онлайн сервера (1-25) либо всех 0
```js
GET /v1/server/:id
```
### Пример ответа
```json
[
  {"serverId":1,"name":"Endurance|1 Perks","map":"c2m1_highway","maxplayers":8,
    "players":[
      {"name":"Sanaaa59","raw":{"score":0,"time":449.9903259277344}},
      {"name":"Donald_Duck_59","raw":{"score":11,"time":449.8890075683594}}
    ], "connect":"188.127.225.21:27015","timestamp":"2023-09-22T14:06:00.804Z"}
]
```
## • steam_group
Количество участников группы Steam
```js
GET /v1/steam_group
```
### Пример ответа
```json
{"members":"2,127","inGame":"116","online":"520"}
```

## • get_steam
Принимает 3 вариации steam id | комьюните id | steam url
```js
GET /v1/get_steam/:steam
```
### Пример ответа
```json
{"steamid":"76561198185404058",
  "communityvisibilitystate":1,
  "profilestate":1,
  "personaname":"Чингисхан",
  "profileurl":"https://steamcommunity.com/id/07007000007/",
  "avatar":"https://avatars.steamstatic.com/b72280d008e030119331e40a6a260b9787bd6cb8.jpg",
  "avatarmedium":"https://avatars.steamstatic.com/b72280d008e030119331e40a6a260b9787bd6cb8_medium.jpg",
  "avatarfull":"https://avatars.steamstatic.com/b72280d008e030119331e40a6a260b9787bd6cb8_full.jpg",
  "avatarhash":"b72280d008e030119331e40a6a260b9787bd6cb8",
  "personastate":0}
```
## • top_admins
Получить топ админов
```js
GET /v1/top_admins
```
### Пример ответа
```json
[{"STEAM_ID":"STEAM_1:1:24771971","TotalScore":49553,"GameTime":10571,"LastConnectionTime":"2023-09-21T18:48:18.000Z","Name":"Davy Jones"},
  {"STEAM_ID":"STEAM_1:0:70091580","TotalScore":40543,"GameTime":3465,"LastConnectionTime":"2023-09-22T17:09:47.000Z","Name":"Cerberus"}]
```
## • nickname
Поиск по нику / steamid / url
```js
GET /v1/nickname/:nickname
```
### Пример запроса 
```json
/v1/nickname/буб
```
### Пример ответа
```json
[{"STEAM_ID":"STEAM_1:0:617551468","TotalScore":-779,"GameTime":1011,"LastConnectionTime":"2023-09-21T19:59:02.000Z","Name":"Бубек"},
  {"STEAM_ID":"STEAM_1:0:761695592","TotalScore":-9780,"GameTime":924,"LastConnectionTime":"2023-09-21T14:43:44.000Z","Name":"Бублик"},
  {"STEAM_ID":"STEAM_1:1:753011362","TotalScore":115,"GameTime":318,"LastConnectionTime":"2023-09-15T15:30:03.000Z","Name":"Бубоная чума"}]
```

## • topusers
Получить информацию о топе игроков (количество) (срезом с лимитом)

```js
GET /v1/top_users/:start/:limit'
```

### Все доступные параметры
| Параметр | Тип | Описание            | По умолчанию | лимит  |
|----------| - |---------------------|------|--------|
| count    | int | колличество игроков | 10     | 0-1000 |

### Примеры запросов
```js
/v1/top_users/10/0
```

### Пример ответа
```json
[
  {"STEAM_ID":"STEAM_1:0:564532518","TotalScore":630407,"GameTime":145146,"LastConnectionTime":"2023-08-25T21:14:32.000Z","Name":"Villain"},
  {"STEAM_ID":"STEAM_1:1:424203754","TotalScore":600617,"GameTime":135568,"LastConnectionTime":"2023-08-25T19:21:51.000Z","Name":"Тридня Запоев"},
  {"STEAM_ID":"STEAM_1:0:7276131","TotalScore":471890,"GameTime":113192,"LastConnectionTime":"2023-08-25T16:32:01.000Z","Name":"Добродушная"},
  {"STEAM_ID":"STEAM_1:0:565889198","TotalScore":461641,"GameTime":127372,"LastConnectionTime":"2023-08-25T21:49:03.000Z","Name":"TheUglyyy./"},
  {"STEAM_ID":"STEAM_1:0:722209721","TotalScore":434334,"GameTime":137815,"LastConnectionTime":"2023-08-25T19:53:36.000Z","Name":"Magnus Carlsen"},
  {"STEAM_ID":"STEAM_1:0:182898537","TotalScore":382736,"GameTime":118284,"LastConnectionTime":"2023-08-25T20:58:11.000Z","Name":"Размарин"},
  {"STEAM_ID":"STEAM_1:1:101559893","TotalScore":334412,"GameTime":89461,"LastConnectionTime":"2023-08-24T16:57:31.000Z","Name":"v.s.a. IA v4"},
  {"STEAM_ID":"STEAM_1:0:781748692","TotalScore":317318,"GameTime":62696,"LastConnectionTime":"2023-08-25T13:45:02.000Z","Name":"MEDVEDIZI"},
  {"STEAM_ID":"STEAM_1:0:80175525","TotalScore":298939,"GameTime":85134,"LastConnectionTime":"2023-08-25T15:09:30.000Z","Name":"kira"},
  {"STEAM_ID":"STEAM_1:0:507982372","TotalScore":281052,"GameTime":55200,"LastConnectionTime":"2023-08-25T16:35:16.000Z","Name":"Mnishka"}
]
```


## • elite_users
Проверка активной привилегии и членство в топ **1000** игроков за 6 месяцев

```js
GET /v1/privileges/:steamid
```

### Все доступные параметры
| Параметр | Тип | Описание       |
|----------|-----|----------------|
| steamid    | str | SteamID игрока |

### Примеры запросов
```js
/v1/privileges/STEAM_1:0:155977047
```

### Пример ответа
```json
{
  "Privileges":false,
  "ScoreSystem":true
}
```

## • privileges
Получить привилегию игрока

```js
GET /v1/privileges/:steamid
```

### Все доступные параметры
| Параметр | Тип | Описание       |
|----------|-----|----------------|
| steamid    | str | SteamID игрока |

### Примеры запросов
```js
/v1/privileges/STEAM_1:0:155977047
```

### Пример ответа
```json
{
  "Privileges":[
    {
      "FLAGS":"o",
      "UnixTime_Until":2000000000
    }
  ]
}
```

## • streams
Получить стримы по лефте с твича

```js
GET /v1/streams/left4dead2
```_


## • achievement
Количество попаданий в топ 100 сезона

```js
GET /v1/achievement/:steamid
```

### Все доступные параметры
| Параметр | Тип | Описание       |
|----------|-----|----------------|
| steamid    | str | SteamID игрока |

### Примеры запросов
```js
/v1/achievement/STEAM_1:0:82962447
```

### Пример ответа
```json
[
  {"STEAM_ID":"STEAM_1:0:82962447",
    "CountRanksAbove100":1}
]
```

## • achievement_top
Топ 50 игроков попавших max раз в топ 100 сезона

```js
GET /v1/achievement_top
```

## • allplayers
Возвращает количество игроков из базы данных

```js
GET /v1/allplayers
```


## • alltimescore
Общее количество проведенного на проекте времени и очков

```js
GET /v1/alltimescore/:steamid
```

### Все доступные параметры
| Параметр | Тип | Описание       |
|----------|-----|----------------|
| steamid    | str | SteamID игрока |

### Примеры запросов
```js
/v1/alltimescore/STEAM_1:0:82962447
```

### Пример ответа
```json
[
  {"totalScoreSum":"112544",
    "gameTimeSum":"41975"}
]
```

## • annonce
Возвращает свежие объявления для показа на сайте 

```js
GET /v1/annonce
```


## • bans
Проверяет есть ли активный бан у игрок

```js
GET /v1/bans/:steamid
```

### Все доступные параметры
| Параметр | Тип | Описание       |
|----------|-----|----------------|
| steamid    | str | SteamID игрока |

### Примеры запросов
```js
/v1/alltimescore/STEAM_1:0:82962447
```

### Пример ответа
```json
[
  {"ends":1710787150,
    "length":2592000,
    "reason":"[Little Anti-Cheat 1.7.1] Bhop Detected"}
]
```

## • online_players
Показывает *всех* активных игроков на серверах и информацию о них

```js
GET /v1/online_players
```

### Примеры запросов
```js
/v1/online_players
```

### Пример ответа
```json
[
  {"STEAM_ID":"STEAM_1:0:100750310",
    "TotalScore":4487,
    "GameTime":0,
    "LastConnectionTime":"2024-02-17T19:51:06.000Z",
    "Name":"jelovek",
    "Avatar_url":"https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg"},
]
```
