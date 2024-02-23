# Flask主程序

from flask import Flask

import sys

sys.path.append("/data")

app = Flask(__name__)

from components.database import db

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:admin@localhost/testtest'
db.init_app(app)

from flask_cors import CORS

CORS(app, supports_credentials=True)

# 加载相应组件
from blueprints.favorites import api_favorite
from blueprints.search import api_search
from blueprints.main import api_main
from blueprints.user import api_user

# 将组件注册到主程序上
app.register_blueprint(api_favorite)
app.register_blueprint(api_search)
app.register_blueprint(api_main)
app.register_blueprint(api_user)

app.run(host='0.0.0.0', port=8090, debug=True)

