# Nest Backend 

what technologies are in this repository

- Nest Framework
- MongoDB
- Rabit MQ
- Socket IO

For the installations and documentations you can see reference in below 
- https://docs.nestjs.com/
- https://www.mongodb.com/docs/
- https://www.mongodb.com/docs/
- https://socket.io/docs/v4/

## Getting started

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running Docker Container  

```bash
# docker build
$ docker-compose build 

# docker running
$ docker-compose up 
```

This will build the images and start the containers in detached mode. NestJS application will be accessible at [http://localhost:3000](http://localhost:3000). MongoDB and RabbitMQ will be available at their respective ports.

## Documentation

```bash
# local development
$ npm run doc:api

# production mode
$ node dist/swagger
```

Api documentation will be accessible at [http://localhost:3000/api-docs](http://localhost:3000).

Nest is [MIT licensed](LICENSE).
