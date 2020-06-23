# coding: utf-8

from marshmallow import Schema, fields, pre_load, post_dump

from conduit.profile.serializers import ProfileSchema


class TagSchema(Schema):
    tagname = fields.Str()
    slug = fields.Str()

class ArticleSchema(Schema):
    slug = fields.Str()
    title = fields.Str()
    description = fields.Str()
    createdAt = fields.DateTime(format='%m-%d-%Y')
    body = fields.Str()
    coverImage = fields.Str()
    updatedAt = fields.DateTime(dump_only=True, format='%m-%d-%Y')
    needsReview = fields.Boolean()
    author = fields.Nested(ProfileSchema)

    # for the envelope
    article = fields.Nested('self', exclude=('article',), default=True, load_only=True)
    tagList = fields.Nested(TagSchema, many=True)
    favoritesCount = fields.Int(dump_only=True)
    commentsCount = fields.Int(dump_only=True)
    favorited = fields.Bool(dump_only=True)
    isPublished = fields.Bool()
    views = fields.Int(dump_only=True)

    @pre_load
    def make_article(self, data, **kwargs):
        return data['article']

    @post_dump
    def dump_article(self, data, **kwargs):
        data['author'] = data['author']['profile']
        return {'article': data}

    class Meta:
        strict = True


class ArticleFormSchema(Schema):
    slug = fields.Str()
    title = fields.Str()
    description = fields.Str()
    createdAt = fields.DateTime(format='%m-%d-%Y')
    body = fields.Str()
    coverImage = fields.Str()
    updatedAt = fields.DateTime(dump_only=True, format='%m-%d-%Y')
    needsReview = fields.Boolean()
    author = fields.Nested(ProfileSchema)

    # for the envelope
    article = fields.Nested('self', exclude=('article',), default=True, load_only=True)
    tagList = fields.List(fields.Str())
    favoritesCount = fields.Int(dump_only=True)
    commentsCount = fields.Int(dump_only=True)
    favorited = fields.Bool(dump_only=True)
    isPublished = fields.Bool()

    @pre_load
    def make_article(self, data, **kwargs):
        return data['article']

    @post_dump
    def dump_article(self, data, **kwargs):
        data['author'] = data['author']['profile']
        return {'article': data}

    class Meta:
        strict = True


class ArticleSchemas(ArticleSchema):

    @post_dump
    def dump_article(self, data, **kwargs):
        data['author'] = data['author']['profile']
        return data

    @post_dump(pass_many=True)
    def dump_articles(self, data, many, **kwargs):
        return {'articles': data, 'articlesCount': len(data)}


class CommentSchema(Schema):
    id = fields.Int()
    comment_id = fields.Int()
    body = fields.Str()
    createdAt = fields.DateTime()
    updatedAt = fields.DateTime(dump_only=True)
    author = fields.Nested(ProfileSchema)
    parentComment = fields.Nested('self', many=True)

    # for the envelope
    comment = fields.Nested('self', exclude=('comment',), default=True, load_only=True)

    @pre_load
    def make_comment(self, data, **kwargs):
        return data['comment']

    @post_dump
    def dump_comment(self, data, **kwargs):
        data['author'] = data['author']['profile']

        return {'comment': data}

    class Meta:
        strict = True


class CommentsSchema(CommentSchema):

    @post_dump
    def dump_comment(self, data, **kwargs):
        data['author'] = data['author']['profile']
        return data

    @post_dump(pass_many=True)
    def make_comment(self, data, many, **kwargs):
        return {'comments': data}


article_schema = ArticleSchema()
article_form_schema = ArticleFormSchema()
articles_schema = ArticleSchemas(many=True)
comment_schema = CommentSchema()
comments_schema = CommentsSchema(many=True)
