# -*- coding: utf-8 -*-
"""Helper utilities and decorators."""
from conduit.user.models import User  # noqa
from conduit.exceptions import InvalidUsage
from functools import wraps
from flask_jwt_extended import current_user

def jwt_identity(payload):
    return User.get_by_id(payload)


def identity_loader(user):
    return user.id

def isAdmin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if current_user.isAdmin:
            return fn(*args, **kwargs)
        else:
            return {
                "message": "User is not an admin"
            }, 404
    return wrapper