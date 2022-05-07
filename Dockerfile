# Build stage 1
# Running tests...
#
FROM node:alpine
WORKDIR /usr/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn test

# Build stage 2
# Running tests...
#
FROM node:alpine
WORKDIR /usr/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn dev

