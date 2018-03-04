#!/bin/bash

# Check if taven is installed
if ! hash tavern-ci 2>/dev/null; then
    echo -e 'tavern is not installed.'
    echo -e 'Please install by it by typing pip install tavern'
    exit 0
else
    USER=`echo $RANDOM | md5sum | awk '{ print $1 }'`
    PASS=`echo $USER | md5sum | awk '{ print $1 }'`

    sed -i '/  username: /c\  username: '$USER'' includes.yaml
    sed -i '/  password: /c\  password: '$PASS'' includes.yaml
    tavern-ci --stdout users_test.yaml
fi