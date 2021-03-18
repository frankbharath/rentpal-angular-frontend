FROM node:14.15.1

WORKDIR /usr/src/app

RUN npm install -g @angular/cli@11.0.3

COPY ./package.json .
RUN npm 
RUN echo tsc --version
COPY . .

