FROM node:8-alpine

WORKDIR /app

COPY package.json /app
RUN npm install --production
COPY . /app

EXPOSE 3000
RUN npm run build
CMD ["npm", "start"]

