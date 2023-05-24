FROM node:slim
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm install -g prisma
RUN npx prisma migrate deploy
EXPOSE 8000
CMD ["node", "index.js"]

