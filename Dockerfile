FROM node:23

WORKDIR /app


COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase

ENV NODE_ENV=production


EXPOSE 3000

ENTRYPOINT ["sh", "-c", "npm run build && npm run db:push && node build"]
