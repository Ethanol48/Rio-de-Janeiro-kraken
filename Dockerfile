FROM node:23

WORKDIR /app


COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV DATABASE_URL=postgresql://user:mypassword@0.0.0.0:5432/mydatabase
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["sh", "-c", " npm run db:push && node build"]
