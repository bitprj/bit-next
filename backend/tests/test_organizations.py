from flask import url_for
from datetime import datetime


class TestOrganizationViews:

    def test_create_org(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp.json['organization']['name'] == 'BitProject'
        assert resp.json['organization']['description'] == 'Description here'
        assert resp.json['organization']['slug'] == 'bitprj'


    def test_get_org_by_slug(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp1 = testapp.post_json(url_for('organizations.make_organization'),
            {'organization': {
                'name': 'BitProject',
                'description': 'Description here',
                'slug': 'ree'
                }
            }, headers={
                'Authorization': 'Token {}'.format(token)
            })

        slug = resp1.json['organization']['slug']
        resp = testapp.get(url_for('organizations.get_organization',
                slug=slug), 
            headers = {
            'Authorization': 'Token {}'.format(token)
            })

        assert slug == 'ree'


    def test_update_org(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp1 = testapp.put_json(url_for('organizations.update_organization', 
            slug = "new slug"),{'organization': {
            'old_slug': resp.json['organization']['slug']
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp1.json['organization']['slug'] == 'new slug'


    def test_delete_org(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp1 = testapp.delete(url_for('organizations.delete_organization', 
            slug = resp.json['organization']['slug']),
            headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp1.status_code == 200
        assert resp1.text == ''


    def test_follow_organization(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp1 = testapp.post_json(url_for('organizations.follow_organization',
            slug = resp.json['organization']['slug']), headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp1.json['organization']['name'] == 'BitProject'
        assert resp1.json['organization']['is_following'] == True
        assert resp1.json['organization']['slug'] == 'bitprj'


    def test_unfollow_organization(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp1 = testapp.post_json(url_for('organizations.follow_organization',
            slug = resp.json['organization']['slug']), headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp2 = testapp.delete(url_for('organizations.unfollow_organization',
            slug = resp.json['organization']['slug']), headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp2.json['organization']['name'] == 'BitProject'
        assert resp2.json['organization']['is_following'] == True
        assert resp2.json['organization']['slug'] == 'bitprj'


    def test_promote_member(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp1 = testapp.post_json(url_for('organizations.promote_member',
            slug = resp.json['organization']['slug']),{'profile': {
            "username": user.username
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp1.json['profile']['username'] == user.username


    def test_show_all_members_mods(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        resp1 = testapp.post_json(url_for('organizations.make_organization'),
            {'organization': {
                'name': 'BitProject',
                'description': 'Description here',
                'slug': 'ree'
                }
            }, headers={
                'Authorization': 'Token {}'.format(token)
            })

        slug = resp1.json['organization']['slug']
        resp = testapp.get(url_for('organizations.get_organization',
                slug=slug), 
            headers = {
            'Authorization': 'Token {}'.format(token)
            })

        assert slug == 'ree'


    def test_submit_article_for_review(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        org = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        article = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"],
                "isPublished": "True",
                "coverImage": "Image"
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp1 = testapp.post_json(url_for('organizations.submit_article_for_review',
            slug = article.json['article']['slug'], org_slug= org.json['organization']['slug']), headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp1.json['article']['body'] == 'You have to believe'


    def test_reviewed_article(self, testapp, user):
        user = user.get()
        resp = testapp.post_json(url_for('user.login_user'), 
        {'user': {
            'email': user.email,
            'password': 'myprecious'
        }})

        token = str(resp.json['user']['token'])

        org = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
            'name': 'BitProject',
            'description': 'Description here',
            'slug': 'bitprj'
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        article = testapp.post_json(url_for('articles.make_article'), {
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "You have to believe",
                "tagList": ["reactjs", "angularjs", "dragons"],
                "isPublished": "True",
                "coverImage": "Image"
            }
        }, headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp1 = testapp.post_json(url_for('organizations.submit_article_for_review',
            slug = article.json['article']['slug'], org_slug= org.json['organization']['slug']), headers={
            'Authorization': 'Token {}'.format(token)
        })

        resp2 = testapp.delete(url_for('organizations.reviewed_article',
            slug = article.json['article']['slug'], org_slug= org.json['organization']['slug']), headers={
            'Authorization': 'Token {}'.format(token)
        })

        assert resp2.status_code == 200
        assert resp2.text == ''


    # def test_remove_member(self, testapp, user):
    #     user = user.get()
    #     resp = testapp.post_json(url_for('user.login_user'), 
    #     {'user': {
    #         'email': user.email,
    #         'password': 'myprecious'
    #     }})

    #     token = str(resp.json['user']['token'])

    #     resp = testapp.post_json(url_for('organizations.make_organization'),{'organization': {
    #         'name': 'BitProject',
    #         'description': 'Description here',
    #         'slug': 'bitprj'
    #         }
    #     }, headers={
    #         'Authorization': 'Token {}'.format(token)
    #     })

    #     resp1 = testapp.post_json(url_for('organizations.follow_organization',
    #         slug = resp.json['organization']['slug']), headers={
    #         'Authorization': 'Token {}'.format(token)
    #     })

    #     resp2 = testapp.delete(url_for('organizations.remove_member', 
    #         slug = resp.json['organization']['slug']),{'profile': {
    #         "name": user.name
    #         }
    #     }, headers={
    #         'Authorization': 'Token {}'.format(token)
    #     })

    #     assert resp2.status_code == 200
    #     assert resp2.text == ''