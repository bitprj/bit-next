# -*- coding: utf-8 -*-
"""Model unit tests."""
import datetime as dt

import pytest

from conduit.user.models import User
from conduit.profile.models import UserProfile
from conduit.articles.models import Article, Comment
from conduit.tags.models import Tags
from conduit.organizations.models import Organization

from .factories import UserFactory


@pytest.mark.usefixtures('db')
class TestUser:
    """User tests."""

    def test_get_by_id(self):
        """Get user by ID."""
        user = User('foo', 'foo@bar.com')
        user.save()

        retrieved = User.get_by_id(user.id)
        assert retrieved == user

    def test_created_at_defaults_to_datetime(self):
        """Test creation date."""
        user = User(username='foo', email='foo@bar.com')
        user.save()
        assert bool(user.created_at)
        assert isinstance(user.created_at, dt.datetime)

    def test_password_is_nullable(self):
        """Test null password."""
        user = User(username='foo', email='foo@bar.com')
        user.save()
        assert user.password is None

    def test_factory(self, db):
        """Test user factory."""
        user = UserFactory(password='myprecious')
        db.session.commit()
        assert bool(user.username)
        assert bool(user.email)
        assert bool(user.created_at)
        assert user.check_password('myprecious')

    def test_check_password(self):
        """Check password."""
        user = User.create(username='foo', email='foo@bar.com',
                           password='foobarbaz123')
        assert user.check_password('foobarbaz123')
        assert not user.check_password('barfoobaz')


@pytest.mark.usefixtures('db')
class TestProfile:

    def test_follow_user(self):
        u1 = User('foo', 'foo@bar.com')
        u1.save()
        u2 = User('foo1', 'foo1@bar.com')
        u2.save()
        p1 = UserProfile(u1)
        p2 = UserProfile(u2)
        p1.save()
        p2.save()
        p1.follow(p2)
        assert p1.is_following(p2)

    def test_unfollow_user(self):
        u1 = User('foo', 'foo@bar.com')
        u1.save()
        u2 = User('foo1', 'foo1@bar.com')
        u2.save()
        p1 = UserProfile(u1)
        p2 = UserProfile(u2)
        p1.save()
        p2.save()
        p1.follow(p2)
        assert p1.is_following(p2)
        p1.unfollow(p2)
        assert not p1.is_following(p2)

    def test_follow_self(self):
        u1 = User('foo', 'foo@bar.com')
        u1.save()
        p1 = UserProfile(u1)
        p1.save()
        assert not p1.follow(p1)

    def test_unfollow_self(self):
        u1 = User('foo', 'foo@bar.com')
        u1.save()
        p1 = UserProfile(u1)
        assert not p1.unfollow(p1)


@pytest.mark.usefixtures('db')
class TestArticles:
    def test_create_article(self, user):
        u1 = user.get()
        article = Article(u1.profile, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        assert article.author.user == u1

    def test_favorite_an_article(self):
        u1 = User('foo', 'foo@bar.com')
        u1.save()
        p1 = UserProfile(u1)
        p1.save()
        article = Article(p1, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        assert article.favourite(u1.profile)
        assert article.is_favourite(u1.profile)

    def test_unfavorite_an_article(self):
        u1 = User('foo', 'foo@bar.com')
        u1.save()
        p1 = UserProfile(u1)
        p1.save()

        u2 = User('foo1', 'fo1o@bar.com')
        u2.save()
        p2 = UserProfile(u2)
        p2.save()

        article = Article(p1, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        assert article.favourite(p1)
        assert article.unfavourite(p1)
        assert not article.is_favourite(p1)

    def test_add_tag(self, user):
        user = user.get()
        article = Article(user.profile, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        t = Tags(tagname='python')
        t1 = Tags(tagname='flask')
        assert article.add_tag(t)
        assert article.add_tag(t1)
        assert len(article.tagList) == 2

    def test_remove_tag(self, user):
        user = user.get()
        article = Article(user.profile, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        t1 = Tags(tagname='flask')
        assert article.add_tag(t1)
        assert article.remove_tag(t1)
        assert len(article.tagList) == 0


@pytest.mark.usefixtures('db')
class TestComment:

    def test_make_comment(self, user):
        user = user.get()
        article = Article(user.profile, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        comment = Comment(article, user.profile, 'some body')
        comment.save()

        assert comment.article == article
        assert comment.author == user.profile

    def test_make_comments(self, user):
        user = user.get()
        article = Article(user.profile, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        comment = Comment(article, user.profile, 'some body')
        comment1 = Comment(article, user.profile, 'some body2')
        comment.save()
        comment1.save()

        assert comment.article == article
        assert comment.author == user.profile
        assert comment1.article == article
        assert comment1.author == user.profile
        assert len(article.comments.all()) == 2


@pytest.mark.usefixtures('db')
class TestOrganization:

    def test_add_moderator(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        
        assert organization.add_moderator(user.profile)

    def test_add_member(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        
        assert organization.add_member(user.profile)

    def test_remove_moderator(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        organization.add_member(user.profile)
        
        assert organization.remove_member(user.profile)


    def test_update_slug_true(self):
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()

        return organization.update_slug("New Slug")

    def test_update_slug_false(self):
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()

        return organization.update_slug("New Slug_of_organization") 
        
    def test_is_member(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        organization.add_member(user.profile)  
        
        assert organization.is_member(user.profile)

    def test_moderator(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        organization.add_moderator(user.profile)
        
        assert organization.moderator(user.profile)

    def test_promote(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        organization.add_member(user.profile)  
        
        assert organization.promote(user.profile)

    def test_request_review(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        article = Article(user.profile, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()

        return organization.request_review(article)

    def test_remove_review_status(self, user):
        user = user.get()
        organization = Organization(name="Name_of_organization", description="Description_of_organization", slug="Slug_of_organization")
        organization.save()
        article = Article(user.profile, 'title', 'some body', description='some', isPublished='True', coverImage= "Image")
        article.save()
        organization.pending_articles.append(article)

        return organization.remove_review_status(article)