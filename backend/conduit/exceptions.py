from flask import jsonify


def template(data, code=500):
    return {'message': {'errors': {'body': data}}, 'status_code': code}


USER_NOT_FOUND = template(['User not found'], code=404)
USER_ALREADY_REGISTERED = template(['User already registered'], code=422)
UNKNOWN_ERROR = template([], code=500)
ARTICLE_NOT_FOUND = template(['Article not found'], code=404)
ARTICLE_ALREADY_EXISTS = template(['This article already exists'], code=400)
COMMENT_NOT_OWNED = template(['Not your article'], code=422)
ORGANIZATION_NOT_FOUND = template(['Organization not found'], code=404)
SLUG_ALREADY_EXISTS = template(['This slug already exists'], code=400)
TAG_NOT_FOUND = template(['Tag not found'], code=404)
COMMENT_NOT_OWNED = template(['Not your article'], code=422)
ORGANIZATION_NOT_FOUND = template(['Organization not found'], code=404)
SLUG_ALREADY_EXISTS = template(['This slug already exists'], code=400)
NOT_ADMIN = template(['Not Admin'], code=403)
NOT_MODERATOR = template(['Not Moderator'], code=403)
NOT_ADMIN_OR_MODERATOR = template(['Not Admin or Moderator'], code=403)


class InvalidUsage(Exception):
    status_code = 500

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_json(self):
        rv = self.message
        return jsonify(rv)

    @classmethod
    def user_not_found(cls):
        return cls(**USER_NOT_FOUND)

    @classmethod
    def user_already_registered(cls):
        return cls(**USER_ALREADY_REGISTERED)

    @classmethod
    def unknown_error(cls):
        return cls(**UNKNOWN_ERROR)

    @classmethod
    def article_not_found(cls):
        return cls(**ARTICLE_NOT_FOUND)

    @classmethod
    def article_already_exists(cls):
        return cls(**ARTICLE_ALREADY_EXISTS)

      @classmethod
    def tag_not_found(cls):
        return cls(**TAG_NOT_FOUND)
    
    @classmethod
    def not_admin(cls):
        return cls(**NOT_ADMIN)

    @classmethod
    def not_moderator(cls):
        return cls(**NOT_MODERATOR)

    @classmethod
    def not_admin_or_moderator(cls):
        return cls(**NOT_ADMIN)

    @classmethod
    def comment_not_owned(cls):
        return cls(**COMMENT_NOT_OWNED)

    @classmethod
    def organization_not_found(cls):
        return cls(**ORGANIZATION_NOT_FOUND)

    @classmethod
    def slug_already_exists(cls):
        return cls(**SLUG_ALREADY_EXISTS)

    @classmethod
    def not_admin(cls):
        return cls(**NOT_ADMIN)
    