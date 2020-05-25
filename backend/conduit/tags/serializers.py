# coding: utf-8

from marshmallow import Schema, fields, pre_load, post_dump

class TagSchema(Schema):
    tagname = fields.Str()
    description = fields.Str()
    slug = fields.Str()
    icon = fields.Str()
    modSetting = fields.Int()
    tagFollowers = fields.List(fields.Str())
    moderators = fields.List(fields.Str())

    @pre_load
    def make_Tag(self, data, **kwargs):
        return data

    @post_dump
    def dump_Tag(self, data, **kwargs):
        return {'tag': data}

tag_schema = TagSchema()
tags_schemas = TagSchema(many=True)

