FROM node:alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# COPY --from=development /dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]