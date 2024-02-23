from components.database import db


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    article_id = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.String(256))

    def __init__(self,
                 user_id: int,
                 article_id: int,
                 comments: str):
        self.user_id = user_id
        self.article_id = article_id
        self.comments = comments
