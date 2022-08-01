FROM node:16

ENV NODE_ENV=development
# Create app directory
WORKDIR /app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ADD package*.json .

# RUN npm install
RUN npm ci

# Bundle app source
ADD . .

EXPOSE 3000
