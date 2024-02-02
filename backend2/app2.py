from crypt import methods
import uuid
import pymysql
import hashlib
from flask import Flask,request
from flask_cors import CORS
from utils.user import User
import pickle
from gensim.summarization import bm25


app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/api/search",methods=["POST"])
def search():
    cursor= db.cursor()
    user = User(cursor=cursor)
    token = str(request.form.get("token")).replace(" ","")
    res = user.validate_token(token=token)
    if 'token' not in res:
        db.rollback()
    else:
        token = res['token']
        query = str(request.form.get("query"))
        res = user.query(q=query,model = bm25model)
        res['token'] = token
        res['code'] = 114
        res['msg'] = 'search success'
        db.commit()
    return res



if __name__== "__main__":
    dbhost='localhost'
    dbuser='root'
    dbpass='admin'
    dbname='testtest'
    db=pymysql.connect(host=dbhost,user=dbuser,password=dbpass,database=dbname)
    f =  open("bm25model.pkl","rb")
    bm25model = pickle.load(f)
    f.close()
    app.run(host="0.0.0.0",port=8090)

