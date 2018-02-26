#!/bin/bash

set -e

export NODE_ENV=${NODE_ENV:-"production"}

cd /var/www/api
echo "Initializing API server"

# Install dependencies.
if [ NODE_ENV == "development" ]; then npm install; else npm install --production; fi

# Start the API server in the background.
echo "Starting API server..."
npm run start &

# Wait until server is running.
until $(curl --output /dev/null --silent --head --fail http://localhost:8080); do
    sleep 1
done

echo "API server running at http://0.0.0.0:8080"
