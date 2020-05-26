from flask import Blueprint
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required

from conduit.exceptions import InvalidUsage

from .models import Tags
from conduit.profile.models import UserProfile

from .serializers import tag_schema
from conduit.profile.serializers import profile_schemas

import sys
blueprint = Blueprint('tags', __name__)

print('This is error output', file=sys.stderr)

##########
# Tags
##########

@blueprint.route('/api/tags/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(tag_schema)
@marshal_with(tag_schema)
def update_tag(slug, **kwargs):
    print('aaaa', file=sys.stderr)
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    print('bbbb', file=sys.stderr)
    tag.update(**kwargs)
    print('eeee', file=sys.stderr)
    tag.save()
    return tag


@blueprint.route('/api/tags/<slug>', methods=('DELETE',))
@jwt_required
def delete_tag(slug):
    tag = Tags.query.filter_by(slug=slug).first()
    tag.delete()
    return '', 200

@blueprint.route('/api/tags/<slug>/follow', methods=('POST',))
@jwt_required
@marshal_with(tag_schema)
def follow_a_tag(slug):
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
def unfollow_a_tag(slug):
    profile = current_user.profile
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    tag.unfollow(profile)
    tag.save()
    return tag

@blueprint.route('/api/tags/<slug>/members', methods=('GET',))
def get_members_from_tag(slug):
    followers = UserProfile.query.filter(UserProfile.followed_tags.any(slug=slug)).all()
    moderators = UserProfile.query.filter(UserProfile.moderated_tags.any(slug=slug)).all()
    followers = profile_schemas.dump(followers)
    moderators = profile_schemas.dump(moderators)
    res = {
        'moderators': [],
        'followers': []
    }
    for moderator in moderators:
        moderator['profile'].pop("email", None)
        res['moderators'].append(moderator['profile'])
    for follower in followers:
        follower['profile'].pop("email", None)
        res['followers'].append(follower['profile'])
    return res

@blueprint.route('/api/tags/<slug>/moderator', methods=('POST',))
@jwt_required
@marshal_with(tag_schema)
def claim_tag(slug):
    if not current_user.isAdmin:
        raise InvalidUsage.not_admin()
    tag = Tags.query.filter_by(slug=slug).first()
    tag.addModerator()
    tag.save()
    return tag
