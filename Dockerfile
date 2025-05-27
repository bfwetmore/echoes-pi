# echoes-pi/Dockerfile
FROM node:19.6-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
