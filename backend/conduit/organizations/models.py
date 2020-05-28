import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)
from conduit.profile.models import UserProfile


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


class Organization(Model, SurrogatePK):
    __tablename__ = 'organization'

    id = db.Column(db.Integer, primary_key=True)
    name = Column(db.String(100), nullable=False)
    slug = Column(db.Text, nullable=False, unique=True)
    description = Column(db.Text, nullable=False)
    createdAt = Column(db.DateTime, default=dt.datetime.utcnow)
    moderators = relationship('UserProfile', secondary=moderator_assoc,
                              backref=db.backref('mod_organization'), lazy='dynamic')
    members = relationship('UserProfile', secondary=member_assoc, 
                           backref=db.backref('mem_organization'),
                           lazy='dynamic')


    def __init__(self, name, description, slug, **kwargs):
        db.Model.__init__(self, name=name, description=description, 
                          slug=slugify(slug), **kwargs)

    def add_moderator(self, profile):
        if profile not in self.moderators:
            self.moderators.append(profile)
            return True
        return False

    def add_member(self, profile):
        if profile not in self.members:
            self.members.append(profile)
            return True
        return False
        
    def remove_member(self, profile):
        if profile in self.members:
            self.members.remove(profile)
            return True  
        return False

    def update_slug(self, slug):
        if slug != self.slug:
            self.slug = slug
            return True
        return False
