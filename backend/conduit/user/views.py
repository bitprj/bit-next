# -*- coding: utf-8 -*-
"""User views."""
from flask import Blueprint, request, jsonify, g
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, current_user
from sqlalchemy.exc import IntegrityError

from conduit.database import db
from conduit.extensions import github
from conduit.exceptions import InvalidUsage
from conduit.profile.models import UserProfile
from .models import User
from .serializers import user_schema
from conduit.config import GITHUB_CLIENT, GITHUB_SECRET, ACCESS_TOKEN_URL, GITHUB_API, STATE
import requests
import os

blueprint = Blueprint('user', __name__)

@blueprint.route('/api/users', methods=('POST',))
@use_kwargs(user_schema)
@marshal_with(user_schema)
def register_user(username, password, email, **kwargs):
    try:
        userprofile = UserProfile(User(username, email, password=password, **kwargs).save()).save()
        userprofile.user.token = create_access_token(identity=userprofile.user)
    except IntegrityError:
        db.session.rollback()
        raise InvalidUsage.user_already_registered()
    return userprofile.user

@blueprint.route('/api/users/login', methods=('POST',))
@jwt_optional
@use_kwargs(user_schema)
@marshal_with(user_schema)
def login_user(email, password, **kwargs):
    user = User.query.filter_by(email=email).first()
    if user is not None and user.check_password(password):
        user.token = create_access_token(identity=user, fresh=True)
        return user
    else:
        raise InvalidUsage.user_not_found()


@blueprint.route('/api/user', methods=('GET',))
@jwt_required
@marshal_with(user_schema)
def get_user():
    user = current_user
    # Not sure about this
    user.token = request.headers.environ['HTTP_AUTHORIZATION'].split('Token ')[1]
    return current_user


@blueprint.route('/api/user', methods=('PUT',))
@jwt_required
@use_kwargs(user_schema)
@marshal_with(user_schema)
def update_user(**kwargs):
    user = current_user
    # take in consideration the password
    password = kwargs.pop('password', None)
    if password:
        user.set_password(password)
    if 'updated_at' in kwargs:
        kwargs['updated_at'] = user.created_at.replace(tzinfo=None)
    user.update(**kwargs)
    return user

@blueprint.route('/api/user/callback/<github_code>/<state>', methods = ('GET',)) 
@use_kwargs(user_schema)   
@marshal_with(user_schema)
def github_oauth(github_code, state):
    try:    
        if (state.strip() != STATE):
            raise InvalidUsage.user_not_found()

        payload = { 'client_id': GITHUB_CLIENT,  
                    'client_secret': GITHUB_SECRET,
                    'code': github_code,
                    }
        header = {
            'Accept': 'application/json',
        }

        auth_response = requests.post(ACCESS_TOKEN_URL, params=payload, headers=header).json()
        access_token = auth_response["access_token"]

        auth_header = {"Authorization": "Bearer " + access_token}
        data_response = requests.get(GITHUB_API + 'user', headers=auth_header).json()
        email_response = requests.get(GITHUB_API + 'user/emails', headers=auth_header).json()

        username = data_response["login"]
        email = email_response[0]["email"]
        github_id = data_response["id"]

        user = User.query.filter_by(email=email).first()
        if user is None:
            userprofile = UserProfile(User(username, email, github_access_token = access_token).save()).save()
            user = userprofile.user

        user.token = create_access_token(identity=user, fresh=True)
        return user
    except:
        raise InvalidUsage.user_not_found() 
