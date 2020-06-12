# coding: utf-8

from flask import url_for
from datetime import datetime


class TestTags:

    def test_update_tag(slug, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        token = str(resp.json['user']['token'])
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })
        resp = testapp.put_json(url_for('tags.update_tag',
            slug=resp1.json['article']['tagList'][0]),{
                "tag": {
                    "tagname": "reactjs",
                    "description": "how to learn reactjs",
                    "slug": "reactjs",
                    "icon": "\ud83c\udde8\ud83c\uddf3",
                    "modSetting": 1
                }
            },
            headers={
                'Authorization': 'Token {}'.format(token)
            }
        )
        assert resp.json['tag']['description'] == 'how to learn reactjs'


    def test_delete_tag(slug, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        token = str(resp.json['user']['token'])
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })
        resp = testapp.delete(url_for('tags.delete_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(token)
            }
        )
        assert resp.status_code == 200
        assert resp.text == ''


    def test_follow_a_tag(slug, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        token = str(resp.json['user']['token'])
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })
        resp = testapp.post(url_for('tags.follow_a_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(token)
            }
        )
        assert len(resp.json['tag']['tagFollowers']) == 1


    def test_unfollow_a_tag(slug, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        token = str(resp.json['user']['token'])
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })
        resp = testapp.post(url_for('tags.follow_a_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(token)
            }
        )
        resp = testapp.delete(url_for('tags.unfollow_a_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(token)
            }
        )
        assert len(resp.json['tag']['tagFollowers']) == 0


    def test_claim_tag(slug, testapp, user, admin):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        token = str(resp.json['user']['token'])
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })
        resp = testapp.post(url_for('tags.claim_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(token)
            },
            expect_errors=True
        )
        assert resp.status_code == 403
        assert resp.json['message'] == "User is not an admin"

        admin = admin.get()
        adminLoginResp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': admin.email,
            'password': 'thunder'
        }})
        token = str(adminLoginResp.json['user']['token'])
        resp = testapp.post(url_for('tags.claim_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(token)
            },
        )
        assert len(resp.json['tag']['moderators']) == 1

    def test_get_members_from_tag(slug, testapp, user, admin):
        user = user.get()
        admin = admin.get()
        userResp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        adminResp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': admin.email,
            'password': 'thunder'
        }})
        userToken = str(userResp.json['user']['token'])
        adminToken = str(adminResp.json['user']['token'])

        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(userToken)
        })
        testapp.post(url_for('tags.follow_a_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(userToken)
            }
        )
        resp = testapp.post(url_for('tags.claim_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(adminToken)
            }
        )
        assert len(resp.json['tag']['tagFollowers']) == 1
        assert len(resp.json['tag']['moderators']) == 1


    def test_invite_moderator(slug, testapp, user, admin):
        user = user.get()
        admin = admin.get()
        userResp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        adminResp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': admin.email,
            'password': 'thunder'
        }})
        userToken = str(userResp.json['user']['token'])
        adminToken = str(adminResp.json['user']['token'])
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(userToken)
        })
        resp = testapp.post(url_for('tags.invite_moderator',
            slug=resp1.json['article']['tagList'][0], username=user.username),
            headers={
                'Authorization': 'Token {}'.format(adminToken)
            }
        )
        assert resp.json['profile']['username'] == user.username


    def test_review_article(slug, testapp, user, admin):
        user = user.get()
        admin = admin.get()
        userResp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})
        adminResp = testapp.post_json(url_for('user.login_user'), {'user': {
            'email': admin.email,
            'password': 'thunder'
        }})
        userToken = str(userResp.json['user']['token'])
        adminToken = str(adminResp.json['user']['token'])

        # create tags: "reactjs", "angularjs"
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(userToken)
        })

        # modify modSetting for "reactjs"
        testapp.put_json(url_for('tags.update_tag',
            slug=resp1.json['article']['tagList'][0]),{
                "tag": {
                    "tagname": "reactjs",
                    "description": "how to learn reactjs",
                    "slug": "reactjs",
                    "icon": "\ud83c\udde8\ud83c\uddf3",
                    "modSetting": 2
                }
            },
            headers={
                'Authorization': 'Token {}'.format(userToken)
            }
        )

        # test creating new article with a modSetting 2 tag
        resp1 = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to learn React",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs"]
            }
        }, headers={
            'Authorization': 'Token {}'.format(userToken)
        })

        assert resp1.json['article']['needsReview'] == True

        # admin claim the tag 'reactjs'

        testapp.post(url_for('tags.claim_tag',
            slug=resp1.json['article']['tagList'][0]),
            headers={
                'Authorization': 'Token {}'.format(adminToken)
            },
        )

        resp = testapp.put_json(url_for('tags.review_article',
                slug=resp1.json['article']['tagList'][0], 
                articleSlug = resp1.json['article']['slug']
                ),
            headers={
            'Authorization': 'Token {}'.format(adminToken)
        })

        assert resp.json['article']['needsReview'] == False




