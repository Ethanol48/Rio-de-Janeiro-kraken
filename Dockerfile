FROM node:23

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN touch local.db
RUN npm run db:push
RUN npm run build

EXPOSE 4173

ENTRYPOINT ["npm", "run", "preview", "--", "--host"]
