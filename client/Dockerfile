FROM node:8-alpine

WORKDIR /app

COPY package.json /app
# RUN npm install --production
RUN yarn install --production
COPY . /app

EXPOSE 3000
# RUN npm run build
# CMD ["npm", "start"]
RUN yarn run build
CMD ["yarn", "start"]

