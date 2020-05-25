import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)
from conduit.profile.models import UserProfile
from conduit.user.models import User


moderator_assoc = db.Table("moderator_assoc",
                        db.Column("moderator", db.Integer,
                            db.ForeignKey('userprofile.id')),
                        db.Column("organization", db.Integer,
                            db.ForeignKey('organization.id'))
                        )

member_assoc = db.Table("member_assoc",
                    db.Column("member", db.Integer, 
                        db.ForeignKey('userprofile.id')),
                    db.Column("organization", db.Integer,
                        db.ForeignKey('organization.id'))
                    )   

follower_assoc = db.Table("follower_assoc",
                    db.Column("follower", db.Integer, 
                        db.ForeignKey('userprofile.id')),
                    db.Column("organization", db.Integer,
                        db.ForeignKey('organization.id'))
                    )


class Organization(Model, SurrogatePK):
    __tablename__ = 'organization'

    id = db.Column(db.Integer, primary_key=True)
    name = Column(db.String(100), nullable=False)
    slug = Column(db.Text, nullable=False)
    description = Column(db.Text, nullable=False)
    createdAt = Column(db.DateTime, default=dt.datetime.utcnow)
    moderators = relationship('UserProfile', secondary=moderator_assoc,
                              backref=db.backref('mod_organization'))
    members = relationship('UserProfile', secondary=member_assoc, 
                           backref=db.backref('mem_organization'))
    followers = relationship('UserProfile', secondary=follower_assoc,
                            backref=db.backref('org_follower'))

    # Constructor to take in name, slug & description
    def __init__(self, name, slug=None, description, **kwargs):
        db.Model.__init__(self, name=name, slug=slug or slugify(name), 
                          description=description, **kwargs)

    # Method to allow user to follow organization
    def follow(self, profile):
        if not self.is_following(profile):
            self.followers.append(profile)
            return True
        return False

    # Method to allow user to unfollow
    def unfollow(self, profile):
        if self.is_following(profile):
            self.followers.remove(profile)
            return True
        return False

    # Method to check if user is already following organization
    def is_following(self, profile):
        return bool(self.query.filter(
                    follower_assoc.c.follower == profile.id)).count())


    # Method to add member to the organization
    def add_member(self, user):
        return
    # Method to remove member from organization
    