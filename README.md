# Тестовое задание. Стек Nestjs App + Sequelize ORM + PostgreSQL

## env
Переменные окружения для контейнера с posgresql задается в `environment` `docker-compose` файла, для nesjs в файле
`.env` или `.env.development.local`

## Запуск на host машине 
**Нужен PostgreSQL**
```bash
# install dependencies
$ npm install 

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Запуск внутри docker container (Рекомендуется)

```bash
#development
$ docker compose up -d --build

#production
$ docker compose -f "docker-compose.yaml" up -d --build
```

## Migrations
Выполнить команду на хост машине или внутри контейнера:  
`npx sequelize db:migrate && npx sequelize db:seed:all`

## Endpoints
Entity User:
* `POST users/register`  
payload: `{username, email, password}`  
response: `User`  
description: Регистрирует пользователя, отправляет письмо на email и возвращает запись из бд 

* `POST users/login`  
payload: `{username?, email?, password}`  
response: `access_token: <jwtToken>`,
description: Выполняет аутентификацию пользователя(по `email` или `username`), если данные валидны, возвращает JWT токен. 

* `GET /users/me`  
jwtRequeired: `true`  
response: `User`
description: Возвращает текущего пользователя

* `PUT`

