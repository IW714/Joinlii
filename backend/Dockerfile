FROM node:18.17.0-alpine

WORKDIR /app

COPY package.json ./
RUN npm install
RUN npm install -g nodemon

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run dev"]