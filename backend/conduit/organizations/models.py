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

article_assoc = db.Table("article_assoc",
                    db.Column("article", db.Integer,
                        db.ForeignKey('article.id')),
                    db.Column("organization", db.Integer,
                        db.ForeignKey('organization.id'))
                    )


class Organization(Model, SurrogatePK):
    __tablename__ = 'organization'

    id = db.Column(db.Integer, primary_key=True)
    name = Column(db.String(100), nullable=False)
    slug = Column(db.Text, nullable=False, unique=True)
    description = Column(db.Text, nullable=False)
    image = Column(db.Text, nullable=True)
    createdAt = Column(db.DateTime, default=dt.datetime.utcnow)
    moderators = relationship('UserProfile', secondary=moderator_assoc,
                              backref=db.backref('mod_organization'), lazy='dynamic')
    members = relationship('UserProfile', secondary=member_assoc, 
                           backref=db.backref('mem_organization'),
                           lazy='dynamic')
    pending_articles = relationship('Article', secondary=article_assoc,
                                backref=db.backref('article_organization'),
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

    def is_member(self, profile):
        if profile in self.members:
            return True
        return False

    def moderator(self, profile):
        if profile in self.moderators:
            return True
        return False

    def promote(self, user_profile):
        if user_profile in self.members:
            self.members.remove(user_profile)
            self.moderators.append(user_profile)
            return True
        return False

    def request_review(self, article):
        if article not in self.pending_articles:
            self.pending_articles.append(article)
            return True
        return False

    def remove_review_status(self, article):
        if article in self.pending_articles:
            self.pending_articles.remove(article)
            return True
        return False

    @property
    def is_following(self):
        if current_user:
            return current_user.profile in self.members or current_user.profile in self.moderators 
        return False

    @property
    def is_moderator(self):
        if current_user:
            return current_user.profile in self.moderators
        return False
