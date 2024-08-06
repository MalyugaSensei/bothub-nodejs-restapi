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
Swagger документ - http://localhost:3000/api/v1/