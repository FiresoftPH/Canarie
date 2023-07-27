# Use the official Python 3.10 slim image as the base
FROM python:3.10-slim

# Install required packages
RUN apt-get update && apt-get install -y \
    git \
    sudo \
    wget

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip3 install --upgrade pip && \
    pip3 install PyMySQL && \
    # pip3 install fschat && \
    pip install --no-cache-dir -r requirements.txt

RUN pip3 install flask google-auth

RUN pip3 install bitsandbytes

RUN pip3 install accelerate

RUN pip3 install scipy

RUN pip3 install Flask-OAuthlib

RUN apt-get install -y python3-pygments

RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

RUN pip3 install cryptography

RUN pip3 install einops

# Checkpoint here

# Copy the application files to the working directory
COPY . .

WORKDIR /app

WORKDIR /app/FastChat

RUN pip3 install -e .

WORKDIR /app

# Expose the port
EXPOSE 2424

# Set the default command to run the server
CMD [ "python3", "parrot_server.py" ]

