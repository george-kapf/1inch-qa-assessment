FROM node:18-alpine

WORKDIR /app

# Copy shared dependencies first so Docker layer-caches the install step
COPY package*.json .
RUN npm install

# Build-time arg selects which service script to run (user-service.js or order-service.js)
ARG SERVICE_FILE
COPY ${SERVICE_FILE} ./service.js

ARG PORT=3000
EXPOSE ${PORT}

CMD ["node", "service.js"]
