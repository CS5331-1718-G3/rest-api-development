#!/bin/bash

# Check if taven is installed
if ! hash tavern-ci 2>/dev/null; then
    echo -e 'tavern is not installed.'
    echo -e 'Please install by it by typing pip install tavern'
    exit 0
else
    tavern-ci --stdout user_test.yaml
fi