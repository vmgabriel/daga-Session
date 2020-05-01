# Develop: vmgabriel
# Dev

# Build package and
FROM mhart/alpine-node:13 AS build

RUN npm i -g typescript tsc

RUN mkdir -p /var/www/session-service

COPY package.json /var/www/session-service
COPY .env /var/www/session-service/
COPY certificates/ /var/www/session-service/certificates/
COPY tsconfig.json /var/www/session-service/ 
COPY gruntfile.js /var/www/session-service/gruntfile.js
COPY swagger.json /var/www/session-service/swagger.json
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
FROM mhart/alpine-node:13

RUN apk add nano emacs-nox
RUN npm i -g pm2

ENV appDirBuild /var/www/session-service
ENV appDir /var/www/service

RUN addgroup -S node && adduser -S node -G node
RUN mkdir -p ${appDir}


COPY --from=build ${appDirBuild}/package.json ${appDir}
COPY --from=build ${appDirBuild}/package-lock.json ${appDir}
COPY --from=build ${appDirBuild}/.env ${appDir}

WORKDIR ${appDir}
RUN npm i --production


COPY --from=build ${appDirBuild}/certificates ./certificates
RUN chown -R node:node ./certificates/*
RUN chmod -R o+r ./certificates/www.*
COPY --from=build ${appDirBuild}/dist/index.js ./dist/index.js
COPY --from=build ${appDirBuild}/swagger.json ./dist/swagger.json

USER node
CMD chown -R node:node ./

EXPOSE 7200
CMD ["pm2", "start", "dist/index.js", "--no-daemon"]