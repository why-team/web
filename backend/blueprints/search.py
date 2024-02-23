# 搜索API

from flask import request, Blueprint
from sqlalchemy import and_
import time

from backend.models.article import Article
from backend.components.model import bm25model
from backend.components.database import db2 as db
from backend.components.graph_data import graph_data
from backend.utils.user import User
from backend.utils.preprocessor import Preprocessor

api_search = Blueprint('api_search', __name__, template_folder='templates')
user = User(cursor=db.cursor(), conn=db)
preprocessor = Preprocessor()           # 字符预处理器，用于处理用户传来的query

# API：文章搜索
# 接受query作为搜索输入，返回文章信息和文章关系图信息
@api_search.route('/api/search', methods=['GET', 'POST'])
def getSearchResult():
    start_time = time.time()            # 开始计时
    try:
        user_query = request.form.get('query')
        token = request.form.get('token')
        # print(token)
        if user_query is None or token is None:
            raise ValueError
    except:                             # json格式无效
        return {
            'code': 101,
            'message': 'Invalid request. Check your JSON format.'
        }

    validate_result = user.validate_token(token)    # 尝试检验用户token
    # print(validate_result)
    if 'token' not in validate_result:              # 用户token无效
        return {
            'code': 102,
            'message': validate_result['msg']
        }

    tokens = preprocessor.preprocess(user_query)    # 对用户query预处理
    scores = bm25model.get_scores(tokens)           # 计算每篇文章的得分
    article_ids = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:100]
    article_ids = list(filter(lambda id: id <= 4420, article_ids))
    article_ids = [article_id + 1 for article_id in article_ids]

    # print(article_ids)

    # 注意在sql查询时提出摘要为空的无效文章
    sql_query = Article.query.filter(and_(Article.id.in_(article_ids), Article.abstract != 'nan')).limit(20)
    articles = sql_query.all()

    results = {
        'count': len(articles),
        'token': validate_result['token'],
        'articles': [],
        'graphs': {}
    }

    queryed_article_ids = []
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
            # 'references': sql_article.reference_list()
        }
        results['articles'].append(article)
        queryed_article_ids.append(sql_article.id)

    # 获取图表信息
    nodes, vertices = graph_data.get_graph(queryed_article_ids)
    results['graphs']['node_count'] = len(nodes)
    results['graphs']['vertex_count'] = len(vertices)
    results['graphs']['nodes'] = nodes
    results['graphs']['vertices'] = vertices
    
    end_time = time.time()
    results['time'] = end_time - start_time
    # results['log'] = log

    return results
