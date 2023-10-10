# Use a lightweight Node.js base image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application files to the container
COPY . .

# Build your Express.js app (if necessary)
# RUN npm run build

# ---------------
# Production Image
# ---------------

# Start with a minimal Alpine Linux image
FROM alpine:latest

# Set the working directory in the container
WORKDIR /app

# Install only necessary dependencies
RUN apk --no-cache add nodejs

# Copy built application from the builder stage
COPY --from=builder /app .

# Expose the port your app runs on
EXPOSE 4000

# Command to run your application
CMD ["node", "app.js"]
