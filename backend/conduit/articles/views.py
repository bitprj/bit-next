# coding: utf-8

import datetime as dt

from flask import Blueprint, jsonify
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields

from conduit.exceptions import InvalidUsage
from conduit.user.models import User        
from .models import Article, Tags, Comment
from .serializers import (article_schema, articles_schema, article_form_schema, comment_schema,
                          comments_schema)
from conduit.organizations.models import Organization


blueprint = Blueprint('articles', __name__)


##########
# Articles
##########

#Route to return an article
@blueprint.route('/api/articles', methods=('GET',))
@jwt_optional
@use_kwargs({'tag': fields.Str(), 'author': fields.Str(),
             'favorited': fields.Str(), 'limit': fields.Int(), 'offset': fields.Int(), 'isPublished': fields.Str()})
@marshal_with(articles_schema)
def get_articles(isPublished=None, tag=None, author=None, favorited=None, limit=20, offset=0):
    res = Article.query.filter_by(needsReview=False)
    if isPublished is not None:
        if isPublished != 'all':
          res = Article.query.filter_by(isPublished=True, needsReview=False)
    if tag:
        res = res.filter(Article.tagList.any(Tags.slug == tag))
    if author:
        res = res.join(Article.author).join(User).filter(User.username == author)
    if author and author == current_user.username:
        res = Article.query
        res = res.join(Article.author).join(User).filter(User.username == author)
    if favorited:
        res = res.join(Article.favoriters).filter(User.username == favorited)

    return res.offset(offset).limit(limit).all()


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
    res = res.join(Article.author).join(User).filter(User.username == current_user.profile.user.username)
    return res.all()


@blueprint.route('/api/organizations/<org_slug>/articles', methods=('GET',))
@jwt_optional
@use_kwargs({'org_slug':fields.Str()})
@marshal_with(articles_schema)
def get_org_articles(org_slug):
    articles = Article.query
    org_articles = articles.join(Article.org_articles).filter(Organization.slug == org_slug).all()
    
    return org_articles


#Route to create an article
@blueprint.route('/api/articles', methods=('POST',))
@jwt_required
@use_kwargs(article_form_schema)
@marshal_with(article_form_schema)
def make_article(body, title, description, isPublished, coverImage, tagList=None):
    article = Article(title=title, description=description, body=body,
                      author=current_user.profile, isPublished=isPublished, coverImage=coverImage)
    if tagList is not None:
        for tag in tagList:
            mtag = Tags.query.filter_by(tagname=tag).first()
            if not mtag:
                mtag = Tags(tag)
                mtag.save()
            if mtag.modSetting == 3:
                if current_user.isAdmin:
                    article.add_tag(mtag)
            elif mtag.modSetting == 2:
                article.add_needReviewTag(mtag)
                article.add_tag(mtag)
                article.needsReview = True
            else: # mtag.modSetting == 1:
                article.add_tag(mtag)
    article.save()
    return article


@blueprint.route('/api/articles/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(article_form_schema)
@marshal_with(article_form_schema)
def update_article(slug, **kwargs):
    article = Article.query.filter_by(slug=slug, author_id=current_user.profile.id).first()
    if not article:
        raise InvalidUsage.article_not_found()
    article.update(updatedAt=dt.datetime.utcnow(), **kwargs)
    article.save()
    return article


@blueprint.route('/api/articles/<slug>', methods=('DELETE',))
@jwt_required
def delete_article(slug):
    article = Article.query.filter_by(slug=slug, author_id=current_user.profile.id).first()
    article.delete()
    return '', 200


@blueprint.route('/api/articles/<slug>', methods=('GET',))
@jwt_optional
@marshal_with(article_schema)
def get_article(slug):
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        raise InvalidUsage.article_not_found()
    return article


@blueprint.route('/api/articles/<slug>/favorite', methods=('POST',))
@jwt_required
@marshal_with(article_schema)
def favorite_an_article(slug):
    profile = current_user.profile
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        raise InvalidUsage.article_not_found()
    article.favourite(profile)
    article.save()
    return article


@blueprint.route('/api/articles/<slug>/favorite', methods=('DELETE',))
@jwt_required
@marshal_with(article_schema)
def unfavorite_an_article(slug):
    profile = current_user.profile
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        raise InvalidUsage.article_not_found()
    article.unfavourite(profile)
    article.save()
    return article


@blueprint.route('/api/articles/feed', methods=('GET',))
@jwt_required
@use_kwargs({'limit': fields.Int(), 'offset': fields.Int()})
@marshal_with(articles_schema)
def articles_feed(limit=20, offset=0):
    return Article.query.join(current_user.profile.follows). \
        order_by(Article.createdAt.desc()).offset(offset).limit(limit).all()


#Route to bookmark a particular article
@blueprint.route('/api/articles/<slug>/bookmark', methods=('POST',))
@jwt_required
@marshal_with(article_schema)
def bookmark_an_article(slug):
    profile = current_user.profile
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        raise InvalidUsage.article_not_found()
    article.bookmark(profile)
    article.save()
    return article


######
# Tags
######

@blueprint.route('/api/tags', methods=('GET',))
def get_tags():
    return jsonify({'tags': [(tag.tagname, tag.slug) for tag in Tags.query.all()]})


##########
# Comments
##########


@blueprint.route('/api/articles/<slug>/comments', methods=('GET',))
@marshal_with(comments_schema)
def get_comments(slug):
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        raise InvalidUsage.article_not_found()
    return article.comments
    

@blueprint.route('/api/articles/<slug>/comments', methods=('POST',))
@jwt_required
@use_kwargs(comment_schema)
@marshal_with(comment_schema)
def make_comment_on_article(slug, body, comment_id=None, **kwargs):
    article = Article.query.filter_by(slug=slug).first()
    if not article and not comment_id:
        raise InvalidUsage.article_not_found()
    if comment_id:
        comment = Comment(None, current_user.profile, body, comment_id, **kwargs)
    else:
        comment = Comment(article, current_user.profile, body, comment_id, **kwargs)
    comment.save()
    return comment


@blueprint.route('/api/articles/<slug>/comments/<cid>', methods=('DELETE',))
@jwt_required
def delete_comment_on_article(slug, cid):
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        raise InvalidUsage.article_not_found()

    comment = article.comments.filter_by(id=cid, author=current_user.profile).first()
    comment.delete()
    return '', 200
