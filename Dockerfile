# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies based on the package definitions
COPY package*.json ./
RUN npm install

# Copy the rest of the application source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
