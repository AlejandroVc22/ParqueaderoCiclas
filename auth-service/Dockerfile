FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV NODE_ENV=production
ENV PORT=4001

EXPOSE 4001

CMD ["node", "src/server.js"]
