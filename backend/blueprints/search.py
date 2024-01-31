from flask import request, Blueprint
import heapq

from models.article import Article
from components.model import bm25model
from components.database import db2 as db
from utils.user import User
from utils.preprocessor import Preprocessor

api_search = Blueprint('api_search', __name__, template_folder='templates')
user = User(cursor=db.cursor())
preprocessor = Preprocessor()

@api_search.route('/api/search', methods=['GET', 'POST'])
def getSearchResult():
    try:
        user_query = request.form.get('query')
        token = request.form.get('token')
        if user_query is None or token is None:
            raise ValueError
    except:
        return {
            'code': 101,
            'message': 'Invalid request. Check your JSON format.'
        }
    
    validate_result = user.validate_token(token)
    if 'token' not in validate_result:
        return {
            'code': 102,
            'message': validate_result['msg']
        }

    tokens = preprocessor.preprocess(user_query)

    scores = bm25model.get_scores(tokens)
    # print(scores.index(max(scores)), max(scores), scores[1])
    article_ids = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:50]

    # print(article_ids)
    articles = []
    for article_id in article_ids:
        sql_query = Article.query.filter(Article.id == article_id + 1)
        queryed_articles = sql_query.all()
        if len(queryed_articles) == 0:
            continue
        article = sql_query.all()[0]
        if article.abstract == 'nan':
            continue
        articles.append(article)
        if len(articles) == 20: break

    results = {
        'count': len(articles),
        'token': validate_result['token'],
        'articles': []
    }
    for sql_article in articles:
        article = {
            'id': sql_article.id,
            'title': sql_article.title,
            'authors': sql_article.authors,
            'doi': sql_article.doi,
            'url': sql_article.url,
            'published_year': sql_article.published_year,
            'published_date': sql_article.published_date,
            'abstract': sql_article.abstract,
            'references': sql_article.reference_list()
        }
        results['articles'].append(article)

    return results
