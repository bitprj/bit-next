# coding: utf-8

import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)


class Tags(Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    tagname = db.Column(db.String(100))
    description = db.Column(db.Text)
    slug = db.Column(db.String(100))
    icon = db.Column(db.String(50))
    modSetting = db.Column(db.Integer, nullable=False, default=1)

    tagFollowers = db.relationship('UserProfile', secondary=tag_follower_assoc, lazy='subquery',
        backref=db.backref('followed_tags', lazy='dynamic'))
    moderators = db.relationship('UserProfile', secondary=tag_moderators_assoc, lazy='subquery',
        backref=db.backref('moderated_tags', lazy='dynamic'))

    def __init__(self, tagname, description=None, slug=None, icon=None, **kwargs):
        db.Model.__init__(self, tagname=tagname, description=description, slug=slug or slugify(tagname),
                            icon=icon, **kwargs)

    def __repr__(self):
        return self.tagname