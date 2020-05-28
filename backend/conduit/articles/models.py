# coding: utf-8

import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)
from conduit.profile.models import UserProfile
from conduit.tags.models import Tags
from conduit.organizations.models import Organization


favoriter_assoc = db.Table("favoritor_assoc",
                           db.Column("favoriter", db.Integer, db.ForeignKey("userprofile.id")),
                           db.Column("favorited_article", db.Integer, db.ForeignKey("article.id")))

tag_assoc = db.Table("tag_assoc",
                     db.Column("tag", db.Integer, db.ForeignKey("tags.id")),
                     db.Column("article", db.Integer, db.ForeignKey("article.id")))

org_assoc = db.Table("org_assoc",
                    db.Column("organization", db.Integer, 
                        db.ForeignKey("organization.id")),
                    db.Column("article", db.Integer, 
                        db.ForeignKey("article.id"))
                    )

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
    article_id = reference_col('article', nullable=False)

    def __init__(self, article, author, body, **kwargs):
        db.Model.__init__(self, author=author, body=body, article=article, **kwargs)


class Article(SurrogatePK, Model):
    __tablename__ = 'article'

    id = db.Column(db.Integer, primary_key=True)
    slug = Column(db.Text, unique=True)
    title = Column(db.String(100), nullable=False)
    description = Column(db.Text, nullable=False)
    body = Column(db.Text)
    createdAt = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    updatedAt = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    needsReview = Column(db.Boolean, nullable=False)
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

    organizations = relationship('Organization', secondary=org_assoc,      
                                 backref=db.backref('org_article'))

    def __init__(self, author, title, body, description, slug=None, **kwargs):
        db.Model.__init__(self, author=author, title=title,    
                          description=description, body=body,
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

    def bookmark(self, profile):
        if not self.is_bookmarked(profile):
            self.bookmarkers.append(profile)
            return True
        return False

    def is_bookmarked(self, profile):
        return bool(self.query.filter(bookmarker_assoc.c.bookmarker == profile.id).count())

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

    @property
    def favoritesCount(self):
        return len(self.favoriters.all())

    @property
    def favorited(self):
        if current_user:
            profile = current_user.profile
            return self.query.join(Article.favoriters).filter(UserProfile.id == profile.id).count() == 1
        return False
