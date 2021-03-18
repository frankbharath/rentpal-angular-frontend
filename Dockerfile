FROM node:14.15.1

WORKDIR /usr/src/app
COPY package.json .

RUN npm install
RUN npm install -g @angular/cli@11.0.3