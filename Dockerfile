FROM resin/raspberry-pi-alpine-node:9.11.2

ARG ARG_ENV=production
ENV NODE_ENV=$ARG_ENV

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install yarn -g
RUN npm install concurrently@5.3.0 -g

COPY . /usr/src/app

RUN script/docker/setup

EXPOSE 5000
CMD [ "script/stack" ]
