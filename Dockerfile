# Official docker image for Node.js
FROM node:12

# Create app directory
WORKDIR /app

# Copy all of source code to docker container
COPY . .

# Install app dependencies and nodemon for running our app
RUN mkdir node_modules
RUN npm install -g nodemon
RUN npm install

EXPOSE 1337
CMD [ "nodemon" ]
