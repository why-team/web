from flask import request, Blueprint

from components.database import db
from models.favorite import Favorite
from utils.user import User

user = User()

api_favorite = Blueprint('search_api', __name__, template_folder='templates')

@api_favorite.route('/api/favorite/add', methods=['POST'])
def add_favorite():
    json = request.get_json()
    user_id = user.get_user_id(token=json['toekn'])
    try:
        article_id = json['article_id']
    except KeyError:
        return {
            'errno': 101,
            'message': 'Invalid json: Key error'
        }
    
    same = Favorite.query.filter_by(article_id=article_id).count()
    if same > 0:
        return {
            'errno': 102,
            'message': 'Article already in favorites'
        }
    
    try:
        favorite = Favorite(
            user_id=user_id,
            article_id=article_id,
            comments=json['comments'] if 'comments' in json else None
        )
        db.session.add(favorite)
    except:
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

@api_favorite.route('/api/favorite/remove', methods=['POST'])
def remove_favorite():
    json = request.get_json()
    try:
        article_id = json['article_id']
        user_id = user.get_user_id(token=json['token'])
    except KeyError:
        return {
            'errno': 101,
            'message': 'Invalid json: Key error'
        }

    try:
        favorite = Favorite.query.filter_by(article_id=article_id, user_id=user_id)
        if favorite.count() == 0:
            return {
                'errno': 102,
                'message': 'Article not in favorites'
            }
        else:
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
