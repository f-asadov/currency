# Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .
 

EXPOSE 3000
CMD ["sh", "-c", "npm i && npm run build && sleep 5 && npm run start"]


