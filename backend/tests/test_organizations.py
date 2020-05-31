from flask import url_for
from datetime import datetime


class TestOrganizationViews:
    def test_create_org(self, testapp):
     
        response = testapp.post_json(url_for('organizations.make_organization'),{'organization' : {
            'name': 'hi',
            'description': 'fdafdsa'
        }})
