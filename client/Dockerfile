FROM node:18.20.4

WORKDIR /app

COPY package*.json ./

RUN npm install

# No need to copy source files as they will be mounted as a volume
# COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]