# Use a base image with Node.js installed
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project directory into the container
COPY . .

# Copy the package.json and package-lock.json (or yarn.lock) files
# COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory into the container
# COPY . .

# Build the Vite project
RUN npm run build

# Use a lightweight HTTP server to serve the built files
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]