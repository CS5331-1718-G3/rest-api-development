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

# Stop existing container(s)
CONTAINERS=`docker ps -a -q --filter ancestor=$TEAMID`
IFS=$'\n'
for container in $CONTAINERS
do
  echo "Stopping and removing existing container $container..."
  docker kill $container &> /dev/null
  docker rm $container &> /dev/null
done

# Build the image.
docker build -t $TEAMID .

# Start the container.
docker run \
  -p 80:80 \
  -p 8080:8080 \
  -p 3306:3306 \
  -v "$(pwd)"/api/:/var/www/api \
  -v "$(pwd)"/app/:/var/www/app \
  -t $TEAMID
