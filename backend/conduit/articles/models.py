# coding: utf-8

import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)
from conduit.profile.models import UserProfile
from conduit.tags.models import Tags


favoriter_assoc = db.Table("favoritor_assoc",
                           db.Column("favoriter", db.Integer, db.ForeignKey("userprofile.id")),
                           db.Column("favorited_article", db.Integer, db.ForeignKey("article.id")))

comment_like_assoc = db.Table("comment_like_assoc",
                           db.Column("profile_liking_comment", db.Integer, db.ForeignKey("userprofile.id")),
                           db.Column("comment_liked", db.Integer, db.ForeignKey("comment.id")))

tag_assoc = db.Table("tag_assoc",
                     db.Column("tag", db.Integer, db.ForeignKey("tags.id")),
                     db.Column("article", db.Integer, db.ForeignKey("article.id")))

org_assoc = db.Table("org_assoc",
                    db.Column("organization", db.Integer, 
                        db.ForeignKey("organization.id")),
                    db.Column("article", db.Integer, 
                        db.ForeignKey("article.id")))

bookmarker_assoc = db.Table("bookmarker_assoc",
                     db.Column("bookmarker", db.Integer, db.ForeignKey("userprofile.id")),
                     db.Column("bookmarked_article", db.Integer, db.ForeignKey("article.id")))


class Comment(Model, SurrogatePK):
    __tablename__ = 'comment'

    id = db.Column(db.Integer, primary_key=True)
    body = Column(db.Text)
    createdAt = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    updatedAt = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    author_id = reference_col('userprofile', nullable=False)
    author = relationship('UserProfile', backref=db.backref('comments'))
    article_id = reference_col('article', nullable=True)
    comment_id = Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    parentComment = relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    comment_likers = relationship(
        'UserProfile',
        secondary=comment_like_assoc,
        backref='likes',
        lazy='dynamic')

    def __init__(self, article, author, body, comment_id=None, **kwargs):
        db.Model.__init__(self, author=author, body=body, article=article, **kwargs)

    #Function to like a comment
    def like_comment(self, profile):
        if not self.is_liked(profile):
            self.comment_likers.append(profile)
            return True
        return False

    #Function to check if a current like already exists for a particular comment and user
    def is_liked(self, profile):
        return bool(self.query.filter(db.and_(comment_like_assoc.c.profile_liking_comment == profile.id,
            comment_like_assoc.c.comment_liked == self.id)).count())

    @property
    def likesCount(self):
        return len(self.comment_likers.all())


class Article(SurrogatePK, Model):
    __tablename__ = 'article'
    
    id = db.Column(db.Integer, primary_key=True)
    slug = Column(db.Text, unique=True)
    title = Column(db.String(100), nullable=False)
    description = Column(db.Text, nullable=False)
    body = Column(db.Text)
    coverImage = Column(db.Text)
    createdAt = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    updatedAt = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    needsReview = Column(db.Boolean, nullable=False, default=False)
    isPublished = Column(db.Boolean, nullable=False)
    views = Column(db.Integer, nullable=False, default=0)

    author_id = reference_col('userprofile', nullable=False)
    author = relationship('UserProfile', backref=db.backref('articles'))
    favoriters = relationship(
        'UserProfile',
        secondary=favoriter_assoc,
        backref='favorites',
        lazy='dynamic')
    bookmarkers = relationship(
        'UserProfile',
        secondary=bookmarker_assoc,
        backref='bookmarks',
        lazy='dynamic')

    tagList = relationship(
        'Tags', secondary=tag_assoc, backref='articles')

    comments = relationship('Comment', backref=db.backref('article'), lazy='dynamic')

    org_articles = relationship('Organization', secondary=org_assoc,      
                                 backref=db.backref('org_article'))

    def __init__(self, author, title, body, description, coverImage, slug=None, **kwargs):
        db.Model.__init__(self, author=author, title=title,    
                          description=description, body=body, coverImage=coverImage,
                          slug=slug or slugify(title), **kwargs)

    def favourite(self, profile):
        if not self.is_favourite(profile):
            self.favoriters.append(profile)
            return True
        return False

    def unfavourite(self, profile):
        if self.is_favourite(profile):
            self.favoriters.remove(profile)
            return True
        return False

    def is_favourite(self, profile):
        return bool(self.query.filter(favoriter_assoc.c.favoriter == profile.id).count())

    #Function to bookmark an article
    def bookmark(self, profile):
        if not self.is_bookmarked(profile):
            self.bookmarkers.append(profile)
            return True
        return False

    #Function to check if a current bookmark already exists for a particular article and user
    def is_bookmarked(self, profile):
        return bool(self.query.filter(db.and_(bookmarker_assoc.c.bookmarker == profile.id,
            bookmarker_assoc.c.bookmarked_article == self.id)).count())

    def add_tag(self, tag):
        if tag not in self.tagList:
            self.tagList.append(tag)
            return True
        return False    

    def remove_tag(self, tag):
        if tag in self.tagList:
            self.tagList.remove(tag)
            return True
        return False

    def add_organization(self, articles):
        self.needsReview = False
        self.org_articles.append(articles)
        return True

    def add_needReviewTag(self, tag):
        self.needReviewTags.append(tag)
        return True

    def remove_needReviewTag(self, tag):
        if tag in self.needReviewTags:
            self.needReviewTags.remove(tag)
            return True
        return False
    
    def is_allTagReviewed(self):
        return self.needReviewTags.count() == 0

    def set_needsReview(self, val):
        self.needsReview = val
        return self.needsReview

    @property
    def favoritesCount(self):
        return len(self.favoriters.all())

    @property
    def commentsCount(self):
        return len(self.comments.all())

    @property
    def favorited(self):
        if current_user:
            profile = current_user.profile
            return self.query.join(Article.favoriters).filter(UserProfile.id == profile.id).count() == 1
        return False
