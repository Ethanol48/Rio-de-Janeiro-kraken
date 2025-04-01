FROM node:23

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV DATABASE_URL="local.db"

RUN touch local.db
RUN npm run db:migrate
RUN npm run db:push
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "build"]
