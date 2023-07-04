FROM node:14

WORKDIR /app


RUN npm install express body-parser ejs

COPY package*.json ./

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD [ "node", "poker.js" ]
