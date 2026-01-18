# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build

CMD ["node", "dist/main"]