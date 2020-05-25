# coding: utf-8

from marshmallow import Schema, fields, pre_load, post_dump

from conduit.profile.serializers import ProfileSchema


class OrganizationSchema(Schema):
    name = fields.Str()
    slug = fields.Str()
    description = fields.Str()
    createdAt = fields.DateTime(dump_only=True)
    moderators = fields.Nested(ProfileSchema)
    members = fields.Nested(ProfileSchema)

    @pre_load
    def make_organization(self, data, **kwargs):
        return data['organization']
    
    @post_dump
    def dump_organization(self, data, **kwargs):
        data['organization'] = data['organization']['profile']
        return {'organization': data}

    class Meta:
        strict = True


class OrganizationsSchema(OrganizationSchema):
    
    @post_dump
    def dump_organization(self, data **kwargs):
        data['organization'] = data['organization']['profile']
        return data
    
    @post_dump(pass_many=True)
    def dump_organizations(self, many, **kwargs):
        return {'organizations': data, 'organizationsCount': len(data)}


organization_schema = OrganizationSchema()
organizations_schema = OrganizationsSchema(many=True)