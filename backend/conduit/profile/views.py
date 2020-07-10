# coding: utf-8

from flask import Blueprint
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required, jwt_optional

from conduit.exceptions import InvalidUsage
from conduit.user.models import User
from conduit.tags.models import Tags
from conduit.articles.models import Article
from marshmallow import fields

from .serializers import profile_schema
from conduit.tags.serializers import tags_schemas
from conduit.user.serializers import followers_schema
from conduit.articles.serializers import articles_schema
from conduit.organizations.serializers import organizations_schema

blueprint = Blueprint('profiles', __name__)


@blueprint.route('/api/profiles/<username>', methods=('GET',))
@jwt_optional
@marshal_with(profile_schema)
def get_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    return user.profile


@blueprint.route('/api/profiles/<username>/follow', methods=('POST',))
@jwt_required
@marshal_with(profile_schema)
def follow_user(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    current_user.profile.follow(user.profile)
    current_user.profile.save()
    return user.profile


@blueprint.route('/api/profiles/<username>/follow', methods=('DELETE',))
@jwt_required
@marshal_with(profile_schema)
def unfollow_user(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    current_user.profile.unfollow(user.profile)
    current_user.profile.save()
    return user.profile


@blueprint.route('/api/profiles/<username>/tags', methods=('GET',))
@jwt_required
@marshal_with(tags_schemas)
def profile_tags(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    return user.profile.followed_tags


@blueprint.route('/api/profiles/<username>/followers', methods=('GET',))
@jwt_required
@marshal_with(followers_schema)
def get_followers(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    return user.profile.followed_by


@blueprint.route('/api/profiles/<username>/followings', methods=('GET',))
@jwt_required
@marshal_with(followers_schema)
def get_followings(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    return user.profile.follows


#Route to return articles authored by current user
@blueprint.route('/api/profile/articles', methods=('GET',))
@jwt_required
@use_kwargs({'type': fields.Str()})
@marshal_with(articles_schema)
def get_user_articles(type=None):
    res = Article.query
    if type != "all":
        if type == "drafts":
            res = res.filter_by(isPublished=False)
        elif type == "published":
            res = res.filter_by(isPublished=True)
        else:
            raise InvalidUsage.article_not_found()
    res = res.join(Article.author).join(User).filter_by(username=current_user.username)
    return res.all()


@blueprint.route('/api/profile/organizations', methods=('GET',))
@jwt_required
@marshal_with(organizations_schema)
def get_user_organizations():
    return current_user.profile.mem_organization + current_user.profile.mod_organization