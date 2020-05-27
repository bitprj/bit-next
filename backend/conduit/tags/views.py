from flask import Blueprint
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required

from conduit.exceptions import InvalidUsage

from .models import Tags
from conduit.profile.models import UserProfile
from conduit.user.models import User

from .serializers import tag_schema, tag_mebership_schema
from conduit.profile.serializers import profile_schemas


blueprint = Blueprint('tags', __name__)


##########
# Tags
##########

@blueprint.route('/api/tags/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(tag_schema)
@marshal_with(tag_schema)
def update_tag(slug, **kwargs):
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    tag.update(**kwargs)
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
@marshal_with(tag_mebership_schema)
def get_members_from_tag(slug):
    return Tags.query.filter_by(slug=slug).first()

@blueprint.route('/api/tags/<slug>/admin', methods=('POST',))
@jwt_required
def claim_tag(slug):
    if not current_user.isAdmin:
        raise InvalidUsage.not_admin()
    tag = Tags.query.filter_by(slug=slug).first()
    tag.addModerator(current_user.profile)
    tag.save()
    moderators = profile_schemas.dump(tag.moderators)
    response = {
        'moderators' : []
    }
    for moderator in moderators:
        userInfo = {
            'username': moderator['profile']['username'],
            'image': moderator['profile']['image']
        }
        response['moderators'].append(userInfo)
    return response

@blueprint.route('/api/tags/<slug>/moderator/<username>', methods=('POST',))
@jwt_required
def invite_moderator(slug, username):
    tag = Tags.query.filter_by(slug=slug).first()
    profile = current_user.profile
    if not current_user.isAdmin and not tag.isModerator(profile):
        raise InvalidUsage.not_admin_or_moderator()
    
    toBeAddedUser = User.query.filter_by(username=username).first()
    if not toBeAddedUser:
        raise InvalidUsage.user_not_found()
    
    tag.addModerator(toBeAddedUser.profile)
    tag.save()
    moderators = profile_schemas.dump(tag.moderators)
    response = {
        'moderators' : []
    }
    for moderator in moderators:
        userInfo = {
            'username': moderator['profile']['username'],
            'image': moderator['profile']['image']
        }
        response['moderators'].append(userInfo)
    return response


