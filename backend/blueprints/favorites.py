# 收藏夹API，暂未投入使用

from flask import request, Blueprint
import sys
from backend.components.database import db2 as db
from backend.models.favorite import Favorite
from backend.utils.user import User

# 数据库指针
user = User(cursor=db.cursor(), conn=db)

api_favorite = Blueprint('search_api', __name__, template_folder='templates')

# API：添加单篇文章至收藏夹
# 操作流程：检测json格式、检查文章id是否存在，然后尝试将文章加入收藏夹
@api_favorite.route('/api/favorite/add', methods=['POST'])
def add_favorite():
    json = request.get_json()
    user_id = user.get_user_id(token=json['token'])
    try:
        article_id = json['article_id']
    except KeyError:        # json未提供用户id，返回格式错误
        return {
            'errno': 101,
            'message': 'Invalid json: Key error'
        }

    same = Favorite.query.filter_by(article_id=article_id).count()
    if same > 0:            # 文章已在收藏夹内
        return {
            'errno': 102,
            'message': 'Article already in favorites'
        }

    try:                    # 试图添加文章进入收藏夹
        favorite = Favorite(
            user_id=user_id,
            article_id=article_id,
            comments=json['comments'] if 'comments' in json else None
        )
        db.session.add(favorite)
    except:                 # 添加失败则回滚sql操作
        db.session.rollback()
        return {
            'errno': 103,
            'message': 'Error when accessing database'
        }
    
    db.session.commit()
    return {
        'errno': 100,
        'message': 'Success'
    }

# API：从收藏夹移除单篇文章
@api_favorite.route('/api/favorite/remove', methods=['POST'])
def remove_favorite():
    json = request.get_json()
    try:
        article_id = json['article_id']
        user_id = user.get_user_id(token=json['token'])
    except KeyError:        # json格式错误
        return {
            'errno': 101,
            'message': 'Invalid json: Key error'
        }

    try:                    # 检查文章是否在收藏夹内
        favorite = Favorite.query.filter_by(article_id=article_id, user_id=user_id)
        if favorite.count() == 0:
            return {
                'errno': 102,
                'message': 'Article not in favorites'
            }
        else:               # 如果文章在收藏夹内则删除文章
            db.session.delete(favorite[0])
    except:
        return {
            'errno': 103,
            'message': 'Error when accessing database'
        }
    
    db.session.commit()
    return {
        'errno': 100,
        'message': 'Success'
    }
