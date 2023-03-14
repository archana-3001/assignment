# FROM mhart/alpine-node:12

ARG F_REGISTRY
FROM ${F_REGISTRY}fxtrt-base-node:14.17.0

WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 8000
CMD ["npm", "start"]
