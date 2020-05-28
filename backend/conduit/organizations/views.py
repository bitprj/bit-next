# coding: utf-8

import datetime as dt

from flask import Blueprint, jsonify
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from conduit.database import db
from conduit.exceptions import InvalidUsage
from conduit.user.models import User
from conduit.profile.models import UserProfile
from .models import Organization
from .serializers import (organization_schema, organizations_schema)

blueprint = Blueprint('organizations', __name__)


###############
# Organizations
###############


@blueprint.route('/api/organizations', methods=('POST',))
@jwt_required
@use_kwargs(organization_schema)
@marshal_with(organization_schema)
def make_organization(name, description, slug, **kwargs):
    try:
        organization = Organization(name=name, description=description, slug=slug)
        user = current_user.profile
        organization.add_moderator(user)
        organization.save()
    except IntegrityError:
        db.session.rollback()
        raise InvalidUsage.slug_already_exists()

    return organization


@blueprint.route('/api/organizations/<slug>', methods=('GET',))
@jwt_optional
@marshal_with(organization_schema)
def get_organization(slug):
    organization = Organization.query.filter_by(slug=slug).first()
    if not organization:
        raise InvalidUsage.organization_not_found()

    return organization


@blueprint.route('/api/organizations/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(organization_schema)
@marshal_with(organization_schema)
def update_organization(slug, old_slug, **kwargs):
    organization = Organization.query.filter_by(slug=old_slug).first()
    if not organization:
        raise InvalidUsage.organization_not_found()
    organization.update_slug(slug)
    organization.update(**kwargs)
    organization.save()

    return organization


@blueprint.route('/api/organizations/<slug>', methods=('DELETE',))
@jwt_required
def delete_organization(slug):
    organization = Organization.query.filter_by(slug=slug).first()
    organization.delete()
    
    return '', 200
