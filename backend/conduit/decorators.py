from flask_jwt_extended import current_user
from functools import wraps

def isAdmin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if current_user.isAdmin:
            return fn(*args, **kwargs)
        else:
            return {
                "message": "User is not an admin"
            }, 403
    return wrapper