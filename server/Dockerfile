FROM node:8-alpine

WORKDIR /app

COPY package.json /app
RUN npm install --production
RUN npm install -g prisma
COPY . /app

EXPOSE 3000
# CMD prisma deploy && npm start
CMD npm start
