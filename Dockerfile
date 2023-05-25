FROM node:slim
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm install -g prisma
RUN npx prisma migrate deploy
EXPOSE 8000
CMD ["node", "index.js"]

