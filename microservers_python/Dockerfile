# Use the Ubuntu base image
FROM ubuntu:latest

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

# Install necessary packages for Python, Flask, and other compilers
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    gcc \
    g++ \
    rustc

# Install Flask and other Python libraries
RUN pip3 install Flask flask-cors pygments

# Create a non-root user
RUN useradd -ms /bin/bash appuser

# Create a directory for the Flask app and set the ownership to the non-root user
WORKDIR /app
RUN chown appuser:appuser /app

# Copy the Flask app files into the container
COPY . .

RUN rm Dockerfile

# Expose the port on which the Flask app will run
EXPOSE 5463

# Run the Flask app

CMD ["python3", "parrot_python.py"]