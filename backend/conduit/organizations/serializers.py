  
# coding: utf-8

from marshmallow import Schema, fields, pre_load, post_dump

from conduit.profile.serializers import ProfileSchema
from .models import Organization


class OrganizationSchema(Schema):
    name = fields.Str()
    slug = fields.Str()
    old_slug = fields.Str()
    description = fields.Str()
    createdAt = fields.DateTime()
    username = fields.Str()
    moderators = fields.Nested(ProfileSchema, many=True)
    members = fields.Nested(ProfileSchema, many=True)

    organization = fields.Nested('self', exclude=('organization',), 
                                default=True, load_only=True)
    
    @pre_load 
    def make_organization(self, data, **kwargs):
        return data['organization']

    @post_dump 
    def dump_organization(self, data, **kwargs):
        data['moderators'] = data['moderators']
        data['members'] = data['members']
        
        return {'organization': data }

    class Meta:
        strict = True


class OrganizationMembersSchema(Schema):
    moderators = fields.Nested(ProfileSchema, many=True)
    members = fields.Nested(ProfileSchema, many=True)

    organization = fields.Nested('self', exclude=('organization',), 
                                default=True, load_only=True)
    
    @pre_load 
    def make_organization(self, data, **kwargs):
        return data['organization']

    @post_dump 
    def dump_organization(self, data, **kwargs):
        data['moderators'] = data['moderators']
        data['members'] = data['members']
        
        return {'organization': data }

    class Meta:
        strict = True


class OrganizationsSchema(OrganizationSchema):
    
    @post_dump
    def dump_organization(self, data, **kwargs):
        data['moderators'] = data['moderators']
        data['members'] = data['members']

        return data
    
    @post_dump(pass_many=True)
    def dump_organizations(self, data, many, **kwargs):
        return {'organizations': data, 'organizationsCount': len(data)}


organization_schema = OrganizationSchema()
organization_members_schema = OrganizationMembersSchema()
organizations_schema = OrganizationsSchema(many=True)