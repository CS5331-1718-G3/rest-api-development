#!/bin/bash

set -e

export PORT=8080

cd /var/www/api
echo "Initializing API server..."
echo

# Install dependencies.
npm install

# Start the API server in the background.
echo "Starting API server..."
npm run start &

# Wait until server is running.
until $(curl --output /dev/null --silent --head --fail http://0.0.0.0:$PORT); do
    sleep 1
done

echo "API server running at http://0.0.0.0:$PORT"
echo "=================="
echo
