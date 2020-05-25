# coding: utf-8

import datetime as dt

from flask import Blueprint, jsonify
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields

from conduit.exceptions import InvalidUsage
from conduit.user.models import user
from .models import Organization
from .serializers import (organization_schema, organizations_schema)

blueprint = Blueprint('organizations', __name__)

###############
# Organizations
###############

@blueprint.route('/api/organizations', methods=('POST',))
@jwt_required
@use_kwargs(organization_schema)
def make_organization(name, description):
    organization = Organization(name=name, description=description, moderators=current_user.profile, members=current_user.profile)

    organization.save()
    return organization


# Get Organization Data
@blueprint.route('/api/organizations/<slug>', methods=('GET',))
@jwt_optional
@marshal_with(organization_schema)
def get_organization(slug):
    organization = Organization.query.filter_by(slug=slug).first()
    if not organization:
        raise InvalidUsage.organization_not_found()
    return organization


# Update Organization
@blueprint.route('/api/organizations/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(organization_schema)
@marshal_with(organization_schema)
def update_organization(slug, **kwargs):
    organization = Organization.query.filter_by(slug=slug).first()
    if not article:
        raise InvalidUsage.organization_not_found()
    organization.update(**kwargs)
    organization.save()
    return organization


# Delete Organization
@blueprint.route('/api/organizations/<slug>', methods=('DELETE',))
@jwt_required
def delete_organization(slug):
    organization = Organization.query.filter_by(slug=slug).first()
    organization.delete()
    return '', 200


# Add follower to organization
@blueprint.route('/api/organizations/<slug>/follow', methods=('POST',))
@jwt_required


# Remove follower from organization
@blueprint.route('/api/organizations/<slug>/follow', methods=('DELETE',))
@jwt_required