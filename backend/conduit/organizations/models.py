import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from conduit.database import (Model, SurrogatePK, db, Column,
                              reference_col, relationship)
from conduit.profile.models import UserProfile

name: string(100)
slug: text
description: text
createdAt: DateTime
moderators: User relationship, use backref to make relationship.
members: User relationship, use backref to make relationship.


class Organization(Model, SurrogatePK):
    __tablename__ = 'organization'

    id = db.Column(db.Integer, primary_key=True)
    name = Column(db.String(100))
    slug = Column(db.Text)
    description = Column(db.Text)
    createdAt = Column(db.DateTime)
    moderators = relationship('User', backref=db.backref('organizations'))
    members = relationship('User', backref=db.backref('organizations'))
