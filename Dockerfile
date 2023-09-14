FROM node:alpine

ENV START_COMMAND=start

WORKDIR /app

COPY package*.json yarn.lock ./
RUN ["yarn"]

COPY . .

RUN mkdir projects

# Run the command on container startup
ENTRYPOINT yarn $START_COMMAND
