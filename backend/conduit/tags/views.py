from flask import Blueprint
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required

from conduit.exceptions import InvalidUsage
from .models import Tags
from .serializers import (tag_schema, profile_schema)

blueprint = Blueprint('tags', __name__)

##########
# Tags
##########

@blueprint.route('/api/tags/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(tag_schema)
@marshal_with(tag_schema)
def update_article(slug, **kwargs):
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    tag.update(**kwargs)
    tag.save()
    return tag


@blueprint.route('/api/tags/<slug>', methods=('DELETE',))
@jwt_required
def delete_article(slug):
    tag = Tags.query.filter_by(slug=slug).first()
    tag.delete()
    return '', 200

@blueprint.route('/api/tags/<slug>/follow', methods=('POST',))
@jwt_required
@marshal_with(tag_schema)
def favorite_an_article(slug):
    profile = current_user.profile
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    tag.follow(profile)
    tag.save()
    return tag


@blueprint.route('/api/tags/<slug>/follow', methods=('DELETE',))
@jwt_required
@marshal_with(tag_schema)
def unfavorite_an_article(slug):
    profile = current_user.profile
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    tag.unfollow(profile)
    tag.save()
    return tag

@blueprint.route('/api/tags/<slug>/members', methods=('GET',))
@marshal_with(profile_schemas)
def get_members_from_tag(slug):
    followers = Tags.query.join(Tags.tagFollowers).filer_by(slug=slug).all()
    moderators = Tags.query.join(Tags.moderators).filer_by(slug=slug)
    console.log(followers)
    return followers