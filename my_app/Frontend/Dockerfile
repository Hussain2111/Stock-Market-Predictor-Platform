# Step 1: Build the React app with Node.js
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY Frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files into the container
COPY Frontend/ ./

# Build the React app (this will create the build folder)
RUN npm run build

# Step 2: Serve the React app with Nginx
FROM nginx:alpine

# Install Node.js and npm to run login_server.js
RUN apk add --no-cache nodejs npm

# Set the working directory for the node server
WORKDIR /app

# Copy the build folder from the build stage to the Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Ensure login_server.js is copied into the container as well
COPY Frontend/login_server.js /app/login_server.js
COPY Frontend/package*.json /app/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install the login_server.js dependencies
RUN npm install --prefix /app

# Expose port 80 for the Nginx server
EXPOSE 80

# Start both the login server and Nginx
CMD ["sh", "-c", "node /app/login_server.js & nginx -g 'daemon off;'"]