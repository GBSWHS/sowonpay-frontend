FROM node:lts-alpine

COPY . /app/

WORKDIR /app

RUN npm i -g pnpm serve

RUN pnpm i

RUN pnpm build

CMD ["serve", "-s", "dist", "-p", "8080"]
