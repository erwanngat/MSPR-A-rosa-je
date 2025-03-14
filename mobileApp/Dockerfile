FROM node:18-alpine

WORKDIR /app

RUN npm install -g expo-cli

COPY . .

RUN npm install

EXPOSE 19000 19001 19002

CMD ["expo", "start", "--tunnel"]