FROM node:slim
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm install -g prisma
RUN npx prisma migrate deploy
EXPOSE 3000
CMD ["node", "index.js"]