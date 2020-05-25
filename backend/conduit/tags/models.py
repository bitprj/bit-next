# coding: utf-8

import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)

tag_follower_assoc = db.Table("tag_follower_assoc",
                     db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
                     db.Column("follower_id", db.Integer, db.ForeignKey("userprofile.id"), primary_key=True))

tag_moderators_assoc = db.Table("tag_moderators_assoc",
                     db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
                     db.Column("moderator_id", db.Integer, db.ForeignKey("userprofile.id"), primary_key=True))


class Tags(Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    tagname = db.Column(db.String(100))
    description = db.Column(db.Text)
    slug = db.Column(db.String(100))
    icon = db.Column(db.String(50))
    modSetting = db.Column(db.Integer)

    tagFollowers = db.relationship('UserProfile', secondary=tag_follower_assoc, lazy='subquery',
        backref=db.backref('followed_tags', lazy='dynamic'))
    moderators = db.relationship('UserProfile', secondary=tag_moderators_assoc, lazy='subquery',
        backref=db.backref('moderated_tags', lazy='dynamic'))

    def __init__(self, tagname, description, slug, icon, modSetting, **kwargs):
        db.Model.__init__(self, tagname=tagname, description=description,
                            slug=slug, icon=icon, modSetting=modSetting)

    def __repr__(self):
        return self.tagname

    def follow(self, profile):
        if not self.is_follow(profile):
            self.tagFollowers.append(profile)
            return True
        return False

    def unfollow(self, profile):
        if self.is_follow(profile):
            self.tagFollowers.remove(profile)
            return True
        return False

    def is_follow(self, profile):
        return bool(self.query.filter(tag_follower_assoc.c.follower_id == profile.id).count())
