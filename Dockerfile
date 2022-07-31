FROM node:16

# Create app directory
WORKDIR /app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ADD package*.json /app/

# RUN npm install
RUN npm ci

# Bundle app source
ADD . /app/

EXPOSE 3000
