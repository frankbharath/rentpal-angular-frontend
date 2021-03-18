FROM node:14.15.1

WORKDIR /usr/src/app

RUN npm install -g @angular/cli@11.0.3
RUN npm install --save-dev @angular-devkit/build-angular

COPY ./package.json .
RUN npm install

COPY . .
RUN ng build
