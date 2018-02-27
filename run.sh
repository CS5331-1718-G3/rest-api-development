#!/bin/bash

if [ "$EUID" -ne 0 ]
then 
  echo "Please run as root"
  exit
fi

# Cross-platform MD5
if [ "$(uname)" == "Darwin" ]; then 
  # For macOS
  MD5=`md5 -q README.md`
else
  # For Linux
  MD5=`md5sum README.md`
fi

TEAMID=`echo $MD5 | cut -d' ' -f 1`

# Recreate all containers with Docker Compose.
docker-compose --project-name $TEAMID up --force-recreate
