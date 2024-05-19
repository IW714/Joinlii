FROM node:18.17.0-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
