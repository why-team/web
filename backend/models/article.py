# 文章类，SQLAlchemy风格

from typing import Union, List
from components.database import db
print("success")

class Article(db.Model):
    __tablename__="Articles"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.String(512), nullable=False)
    authors = db.Column(db.String(512), nullable=False)
    doi = db.Column(db.String(64), nullable=False)
    url = db.Column(db.String(64))
    published_year = db.Column(db.Integer, nullable=False)
    published_date = db.Column(db.String(16), nullable=False)
    abstract = db.Column(db.Text(4096))
    reference = db.Column(db.Text(4096))

    def __init__(self,
                 id: int = None,
                 title: str = None,
                 authors: Union[str, List[str]] = [],
                 doi: str = None,
                 url: str = None,
                 published_year: str = None,
                 published_date: str = None,
                 abstract: str = None,
                 reference: Union[str, List[str]] = []) -> None:
        self.id = id
        self.title = title
        # if isinstance(authors, str):
        #     authors = authors.split(sep='; ')
        if isinstance(authors, list):
            authors = '; '.join(authors)
        self.authors = authors
        self.doi = doi
        self.url = url
        self.published_year = published_year
        self.published_date = published_date
        self.abstract = abstract
        if isinstance(reference, str):
            reference = reference.split(sep='; ')
        self.reference = reference

    def reference_list(self):
        return self.reference.split('; ')