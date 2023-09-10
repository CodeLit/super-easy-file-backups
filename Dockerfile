FROM node:alpine

WORKDIR /app

COPY package*.json yarn.lock ./
RUN ["yarn"]

COPY . .

# Run the command on container startup
ENTRYPOINT ["yarn", "start"]