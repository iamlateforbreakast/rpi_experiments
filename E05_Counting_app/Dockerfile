FROM arm32v7/node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "/bin/sh", "-c", "node server.js >& node.log"]
