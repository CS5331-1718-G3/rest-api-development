#!/bin/bash

set -e

# Start MySQL.
bash /service/start_mysql.sh

# Start the API server.
bash /service/start_api.sh

# Start the web app server.
bash /service/start_app.sh

echo "All services up and running."
echo
echo "MySQL server: 0.0.0.0:3306"
echo "REST API:     0.0.0.0:8080"
echo "Web server:   0.0.0.0:80"
echo
echo "=================="
echo

# Keep Docker container alive.
touch /service/keepalive
tail -f /service/keepalive
