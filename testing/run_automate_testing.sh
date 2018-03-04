#!/bin/bash

# Check if taven is installed
if ! hash tavern-ci 2>/dev/null; then
    echo -e 'tavern is not installed.'
    echo -e 'Please install by it by typing sudo pip install tavern'
    exit 0
else
    USER=`echo $RANDOM | md5sum | awk '{ print $1 }'`
    PASS=`echo $USER | md5sum | awk '{ print $1 }'`

    #Randomise username and password in our test variable file
    sed -i '/  username: /c\  username: '$USER'' includes.yaml
    sed -i '/  password: /c\  password: '$PASS'' includes.yaml

    echo 'TESTING USERS ENDPOINT\n'
    tavern-ci --stdout users_test.yaml

    echo 'TESTING DIARY ENDPOINT\n'
    tavern-ci --stdout diary_test.yaml
fi