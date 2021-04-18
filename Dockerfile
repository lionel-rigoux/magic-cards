FROM alpine:3.9

ARG BUILD_ENV=production
ENV NODE_ENV=$BUILD_ENV

# install tools
RUN apk add nodejs npm

RUN npm install yarn -g
RUN npm install concurrently@5.3.0 -g

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
RUN yarn
ADD ./server/package.json /usr/src/app/server/package.json
RUN cd server; yarn; cd ..;
ADD ./scanner/package.json /usr/src/app/scanner/package.json
RUN cd scanner; yarn; cd ..;
ADD ./client/package.json /usr/src/app/client/package.json
RUN cd client; yarn; cd ..;

# copy app
COPY . /usr/src/app

# build client
RUN cd client && yarn build  && cd ..
RUN mv client/build/* server/public/


EXPOSE 5000
CMD [ "script/stack" ]
