FROM node:slim
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm install -g prisma
RUN npx prisma migrate reset
RUN npx prisma migrate dev
RUN npx prisma migrate deploy
RUN npx prisma db seed
EXPOSE 8000
CMD ["node", "index.js"]

