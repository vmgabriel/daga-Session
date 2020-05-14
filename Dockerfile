# Develop: vmgabriel
# Dev

# Build package and
FROM node:13.14-alpine AS build

RUN apk add python3 make g++
RUN npm i -g typescript

RUN mkdir -p /var/www/session-service

COPY package.json /var/www/session-service
COPY .env /var/www/session-service/
COPY certificates/ /var/www/session-service/certificates/
COPY tsconfig.json /var/www/session-service/ 
COPY gruntfile.js /var/www/session-service/gruntfile.js
COPY tslint.json /var/www/session-service/tslint.json

COPY src /var/www/session-service/src/

WORKDIR /var/www/session-service

RUN npm i

# The step that build the service
RUN npm run grunt

RUN rm -frv /var/www/session-service/tsconfig.json
RUN rm -frv /var/www/session-service/src

# ---------------------------------------------------------
# Container Compiled and OK
FROM node:13.14-alpine

RUN apk add nano emacs-nox python3 make g++
RUN npm i -g pm2

ENV appDirBuild /var/www/session-service
ENV appDir /var/www/service

RUN mkdir -p ${appDir}


COPY --from=build ${appDirBuild}/package.json ${appDir}
COPY --from=build ${appDirBuild}/package-lock.json ${appDir}
COPY --from=build ${appDirBuild}/.env ${appDir}

WORKDIR ${appDir}
RUN npm i --production


COPY --from=build ${appDirBuild}/certificates ./certificates
# RUN chown -R node:node ./certificates/* 
# RUN chmod -R o+r ./certificates/www.*
COPY --from=build ${appDirBuild}/dist/index.js ./dist/index.js

EXPOSE 7200
CMD ["pm2", "start", "dist/index.js", "--no-daemon"]
