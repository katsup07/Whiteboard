FROM node:18.20.4

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemonConfig.js ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev:docker"]