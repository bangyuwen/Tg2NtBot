FROM node:16-alpine3.11

WORKDIR /usr/app
COPY . .

RUN ls
RUN npm install
RUN npm run build

EXPOSE 80
ENV PORT=80

CMD ["npm", "start"]