#!/bin/bash

set -e

export NODE_ENV=${NODE_ENV:-"production"}

cd /var/www/app
echo "Initializing web app server"

# Install dependencies.
if [ NODE_ENV == "development" ]; then npm install; else npm install --production; fi

# Start the app server in the background.
echo "Starting web app server..."
npm run start &

# Wait until server is running.
until $(curl --output /dev/null --silent --head --fail http://localhost:80); do
    sleep 1
done

echo "Web app server running at http://0.0.0.0:80"
