# coding: utf-8

import datetime as dt

from flask import Blueprint, jsonify
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields

from conduit.exceptions import InvalidUsage
from conduit.user.models import User
from .models import Organization
from .serializers import (organization_schema, organizations_schema)

blueprint = Blueprint('organizations', __name__)


###############
# Organizations
###############

# Create Organization
@blueprint.route('/api/organizations', methods=('POST',))
@jwt_required
@use_kwargs(organization_schema)
@marshal_with(organization_schema)
def make_organization(name, description, **kwargs):
    print(name, description,current_user.profile)
    organization = Organization(name=name, description=description)
    organization.add_moderator(current_user)
    organization.save()
    return organization


# # Get Organization Data
# @blueprint.route('/api/organizations/<slug>', methods=('GET',))
# @jwt_optional
# @marshal_with(organization_schema)
# def get_organization(slug):
#     organization = Organization.query.filter_by(slug=slug).first()
#     if not organization:
#         raise InvalidUsage.organization_not_found()
#     return organization


# # Update Organization
# @blueprint.route('/api/organizations/<slug>', methods=('PUT',))
# @jwt_required
# @use_kwargs(organization_schema)
# @marshal_with(organization_schema)
# def update_organization(slug, **kwargs):
#     organization = Organization.query.filter_by(slug=slug).first()
#     if not article:
#         raise InvalidUsage.organization_not_found()
#     organization.update(**kwargs)
#     organization.save()
#     return organization


# # Delete Organization
# @blueprint.route('/api/organizations/<slug>', methods=('DELETE',))
# @jwt_required
# def delete_organization(slug):
#     organization = Organization.query.filter_by(slug=slug).first()
#     organization.delete()
#     return '', 200


# # Add follower to organization
# @blueprint.route('/api/organizations/<slug>/follow', methods=('POST',))
# @jwt_required
# @marshal_with(organization_schema)
# def follow_an_organization(slug):
#     profile = current_user.profile
#     organization = Organization.query.filter_by(slug=slug).first()
#     if not organization:
#         raise InvalidUsage.organization_not_found()
#     organization.follow(profile)
#     organization.save()
#     return organization


# # Remove follower from organization
# @blueprint.route('/api/organizations/<slug>/follow', methods=('DELETE',))
# @jwt_required
# @marshal_with(organization_schema)
# def unfollow_an_organization(slug):
#     profile = current_user.profile
#     organization = Organization.query.filter_by(slug=slug).first()
#     if not organization:
#         raise InvalidUsage.organization_not_found()
#     organization.unfollow(profile)
#     organization.save()
#     return organization


# # Add Member to organization
# @blueprint.route('api/organizations/<slug>/members', methods=('POST',))
# @jwt_required
# @marshal_with(organization_schema)
# def add_member(slug):
#     # search user by username
#     # get user_id
#     user = User.query.filter_by(user_id=user_id).first()
#     organization = Organization.query.filter_by(slug=slug).first()
#     if not organization:
#         raise InvalidUsage.organization_not_found()
#     organization.add_member(user)
# # Remove Member
# # Get all Members & Mods