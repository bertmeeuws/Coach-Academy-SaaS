FROM node:16.1-alpine3.13 AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

FROM node:16.1-alpine3.13 AS dist
WORKDIR /app
RUN yarn global add nodemon # install it globally
COPY --from=base /app .
COPY . .

CMD ["nodemon", "./server.js"]