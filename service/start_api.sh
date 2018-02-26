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
npm run dev &

# Wait until server is running.
until $(curl --output /dev/null --silent --head --fail http://localhost:$PORT); do
    sleep 1
done

echo 
echo "API server running at http://localhost:$PORT"
echo "=================="
echo
