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
        resp = testapp.post_json(url_for('organizations.get_organization',      
                slug=slug), 
            headers = {
            'Authorization': 'Token {}'.format(token)
            })

        assert resp.json['organization']['nanm'] == 'ree'