FROM node:14.15.1

WORKDIR /usr/src/app

RUN npm update
RUN npm install -g @angular/cli@11.0.3
RUN npm install -g typescript@4.0.7
RUN npm install -g @angular-devkit/build-angular@0.1100.3

COPY ./package.json .
RUN npm install

COPY . .
