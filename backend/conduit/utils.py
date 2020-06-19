# -*- coding: utf-8 -*-
"""Helper utilities and decorators."""
from conduit.user.models import User  # noqa
from conduit.exceptions import InvalidUsage

def jwt_identity(payload):
    return User.get_by_id(payload)


def identity_loader(user):
    return user.id