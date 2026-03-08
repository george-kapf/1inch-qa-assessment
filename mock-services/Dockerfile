# PHASE 3 & 4: LINUX-BASED MOCK SERVICE INFRASTRUCTURE
# This file satisfies the requirement for "Linux-based Docker containers."
# We use 'node:18-alpine' because it is a lightweight, secure Linux distribution (Alpine).
FROM node:18-alpine

# SET WORK DIRECTORY: Defines the internal folder where the app logic will live.
WORKDIR /app

# DEPENDENCY MANAGEMENT:
# We copy package files first. This allows Docker to "Cache" the npm install step.
# If the code changes but dependencies don't, Docker skips 'npm install' to speed up builds.
COPY package*.json .
RUN npm install

# DYNAMIC SERVICE SELECTION (THE "ARG" STRATEGY):
# 'ARG SERVICE_FILE' allows us to use ONE Dockerfile for BOTH services.
# When building the User Service, we pass 'user-service.js'.
# When building the Order Service, we pass 'order-service.js'.
ARG SERVICE_FILE
COPY ${SERVICE_FILE} ./service.js

# PORT CONFIGURATION:
# Sets the internal container port (e.g., 3001 or 3002).
ARG PORT=3000
EXPOSE ${PORT}

# EXECUTION:
# Starts the Node.js process. Because of the 'COPY' step above, 
# 'node service.js' will run whichever script was passed in during the build.
CMD ["node", "service.js"]
