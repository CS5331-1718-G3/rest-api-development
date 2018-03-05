# utils.py
from __future__ import print_function
import sys

from uuid import UUID

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

def validate_uuid4_token(response):
    uuid_string = response.json()["token"]["name"]
    
    try:
        val = UUID(uuid_string, version=4)
    except ValueError:
        # If it's a value error, then the string 
        # is not a valid hex code for a UUID.
        return False

    # If the uuid_string is a valid hex code, 
    # but an invalid uuid4,
    # the UUID.__init__ will convert it to a 
    # valid uuid4. This is bad for validation purposes.

    return val.hex == uuid_string

def isDiaryIdInDiaryCollection(response, id):
    # eprint("\n\n\n\n\n\n\n\n\n[MY DEBUG INTERNAL] " + )

    diaries = response.json()['result']

    for diary in diaries:
        if diary['id'] == id:
            return True
    
    return False

#Dont think you can inverse the output for tavern. So for now we use this function
def isDiaryIdNotInDiaryCollection(response, id):   
    diaries = response.json()['result']

    for diary in diaries:
        if diary['id'] == id:
            return False
    
    return True

def checkDiaryIdsIsInResult(response, size, ids):   
    diaries = response.json()['result']

    if len(diaries) != size:
        return False

    counter = 0

    for diary in diaries:
        for id in ids:
            if diary['id'] == id:
                counter += 1

    return counter == size