# MULTISTAGE CONTAUNER BUILD
# BUILD FOR PRODUCTION
FROM node:20.15.0-alpine As build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build && npm prune --production

RUN npm i -g sequelize-cli

RUN npx sequelize db:migrate

RUN npx sequelize db:seed:all

FROM node:20.15.0-alpine As production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

CMD ["npm", "run", "start:prod"]