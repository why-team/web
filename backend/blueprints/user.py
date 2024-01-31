from flask import request, Blueprint

from components.database import db2 as db
from utils.user import User

api_user = Blueprint('api_user', __name__, template_folder='templates')

user = User(cursor=db.cursor())
@api_user.route("/api/register",methods=['POST'])
def register():
    username = str(request.form.get("username")).replace(" ","")
    password = str(request.form.get("password")).replace(" ","")
    cursor= db.cursor()
    user = User(cursor=cursor)
    res = user.register(username=username, password=password)
    if 'token' in res:
        db.commit()
    else:
        db.rollback()
    return res


@api_user.route("/api/login",methods=['POST'])
def login():
    username = str(request.form.get("username")).replace(" ","")
    password = str(request.form.get("password")).replace(" ","")
    res = user.login(username=username, password=password)
    if 'token' in res:
        db.commit()
    else:
        db.rollback()
    return res


@api_user.route("/api/check_token",methods=['POST'])
def check_token():
    token = str(request.form.get("token"))
    res = user.validate_token(token=token)
    if 'token' in res:
        db.commit()
    else:
        db.rollback()
    return res


@api_user.route("/api/change_password",methods=["POST"])
def change_password():
    cursor= db.cursor()
    user = User(cursor=cursor)
    token = str(request.form.get("token")).replace(" ","")
    res = user.validate_token(token=token)
    if 'token' not in res:
        db.rollback()
    else:
        token = res['token']
        username = str(request.form.get("username")).replace(" ","")
        password = str(request.form.get("password")).replace(" ","")
        new_password = str(request.form.get("new_password")).replace(" ","")
        res = user.change_password(username=username,password=password,new_password=new_password)
        if res['code'] == 113:
            res["token"] = token
            db.commit()
        else:
            db.rollback()
    return res