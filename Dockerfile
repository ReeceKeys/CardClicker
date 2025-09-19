# Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g concurrently

COPY . .

EXPOSE 3000 5000
CMD ["concurrently", "npm run backend", "npm run frontend"]
