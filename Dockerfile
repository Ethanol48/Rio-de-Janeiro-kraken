FROM node:23

ARG DATABASE_URL_ARG

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_POST}/${POSTGRES_DB}

RUN npm run db:push
RUN npm run build

# RUN npm run db:migrate


EXPOSE 3000

ENTRYPOINT ["node", "build"]
