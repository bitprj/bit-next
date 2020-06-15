from .models import Tags
from .serializers import tag_schema, tag_mebership_schema

from conduit.decorators import isAdmin
from conduit.exceptions import InvalidUsage
from conduit.profile.models import UserProfile
from conduit.profile.serializers import profile_schema, profile_schemas
from conduit.articles.serializers import article_schema, articles_schema
from conduit.articles.models import Article
from conduit.user.models import User

from flask import Blueprint
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_optional, jwt_required

blueprint = Blueprint('tags', __name__)


##########
# Tags
##########


@blueprint.route('/api/tags/<slug>', methods=('GET',))
@jwt_optional
@marshal_with(tag_schema)
def get_tag(slug, **kwargs):
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    return tag


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
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    return tag


@blueprint.route('/api/tags/<slug>/admin', methods=('POST',))
@jwt_required
@isAdmin
@marshal_with(tag_schema)
def claim_tag(slug):
    profile = current_user.profile
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    tag.addModerator(profile)
    tag.save()
    return tag


@blueprint.route('/api/tags/<slug>/moderator/<username>', methods=('POST',))
@jwt_required
@marshal_with(profile_schema)
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
    return toBeAddedUser

@blueprint.route('/api/tags/<slug>/articles/<articleSlug>', methods=('PUT',))
@jwt_required
@marshal_with(article_schema)
def review_article(slug, articleSlug):
    profile = current_user.profile
    tag = Tags.query.filter_by(slug=slug).first()
    if not tag:
        raise InvalidUsage.tag_not_found()
    if tag not in profile.moderated_tags:
        raise InvalidUsage.not_moderator()
    
    article = Article.query.filter_by(slug=articleSlug).first()
    if not article:
        raise InvalidUsage.article_not_found()
    if article.needsReview:
        article.remove_needReviewTag(tag)
        if article.is_allTagReviewed():
            article.set_needsReview(False)
    article.save()
    return article


#Route to return an article filtered by tag names
@blueprint.route('/api/user/tags/articles', methods=('GET',))
@jwt_optional
@marshal_with(articles_schema)
def get_articles_tags(isPublished=None, tag=None, author=None, favorited=None, limit=5, offset=0):
    tagLists = current_user.profile.followed_tags
    ans = []
    if tagLists is not None:
        for tag in tagLists:
            ans.append(Article.query.filter(Article.tagList.any(Tags.slug == tag.slug)).order_by(Article.id.desc()).limit(5).all())
    if tagLists.count() == 0:
        tagLists = Tags.query.limit(5)
    for tag in tagLists:
        ans.append(Article.query.filter(Article.tagList.any(Tags.slug == tag.slug)).order_by(Article.id.desc()).limit(5).all())
    return [article for list in ans for article in list]