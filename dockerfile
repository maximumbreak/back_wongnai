FROM node:boron

RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
WORKDIR /usr/src/app
RUN npm install
COPY . /usr/src/app

EXPOSE 5555

CMD ["npm", "start" ]