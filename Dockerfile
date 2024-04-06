FROM node:18

# создание директории приложения
WORKDIR /usr/src/app

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./

RUN npm install
# Если вы создаете сборку для продакшн
#RUN npm ci --omit=dev

# копируем исходный код
COPY ../../AppData/Local/Temp/Rar$DRa1724.20369/L4D4_API-main .

EXPOSE 3090
CMD [ "node", "app.js" ]