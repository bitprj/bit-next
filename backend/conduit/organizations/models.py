import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)
from conduit.profile.models import UserProfile
from conduit.user.models import User

moderator_assoc = db.Table("moderator_assoc",
                        db.Column("moderators", db.Integer,
                            db.ForeignKey('userprofile.id'),
                            primary_key=True),
                        db.Column("organization", db.Integer,
                            db.ForeignKey('organization.id'),
                            primary_key=True)
                        )

user_assoc = db.Table("user_assoc",
                    db.Column("members", db.Integer, 
                        db.ForeignKey('userprofile.id'),
                        primary_key=True),
                    db.Column("organization", db.Integer,
                        db.ForeignKey('organization.id'),
                        primary_key=True)
                    )   


class Organization(Model, SurrogatePK):
    __tablename__ = 'organization'

    id = db.Column(db.Integer, primary_key=True)
    name = Column(db.String(100))
    slug = Column(db.Text)
    description = Column(db.Text)
    createdAt = Column(db.DateTime, default=dt.datetime.utcnow)
    moderators = relationship('UserProfile', secondary=moderator_assoc,
                              backref=db.backref('mod_organization'))
    member_id = reference_col('userprofile', nullable=False)
    members = relationship('UserProfile', secondary=user_assoc, 
                           backref=db.backref('mem_organization'))

    # Constructor to take in name, slug & description
    def __init__(self, name, slug=None, description, **kwargs):
        db.Model.__init__(self, name=name, slug=slug or slugify(name), 
                          description=description, **kwargs)