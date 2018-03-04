# utils.py
from uuid import UUID

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
