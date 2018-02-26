#!/bin/bash

set -e

export NODE_ENV=${NODE_ENV:-"production"}
echo "Current environment: $NODE_ENV"

# Start MySQL.
bash /service/start_mysql.sh

# Start the API server.
bash /service/start_api.sh

# Start the web app server.
bash /service/start_app.sh

# Keep Docker container alive.
touch /service/keepalive
tail -f /service/keepalive
