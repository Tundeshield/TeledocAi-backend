FROM python:3.9-slim as python-base

# Install minimal Python dependencies for Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY python-requirements.txt .
RUN pip install --no-cache-dir -r python-requirements.txt

# Node.js stage
FROM node:18-slim

# Copy Python installation from the python-base stage
COPY --from=python-base /usr/local/bin/python3 /usr/local/bin/
COPY --from=python-base /usr/local/lib/python3.9 /usr/local/lib/python3.9/
COPY --from=python-base /usr/local/lib/libpython3.9.so* /usr/local/lib/
COPY --from=python-base /usr/lib/*/libjpeg* /usr/lib/*/
COPY --from=python-base /usr/lib/*/libz* /usr/lib/*/
COPY --from=python-base /usr/local/bin/pip /usr/local/bin/
# Add wget for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"] 