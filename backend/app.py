from flask import Flask
from flask_cors import CORS

import sys
sys.path.append("/data/backend2")

from components.database import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:admin@localhost/testtest'
db.init_app(app)
CORS(app, supports_credentials=True)

# bm25model = init.model.init(app)

from blueprints.favorites import api_favorite
from blueprints.search import api_search
from blueprints.main import api_main
from blueprints.user import api_user

app.register_blueprint(api_favorite)
app.register_blueprint(api_search)
app.register_blueprint(api_main)
app.register_blueprint(api_user)

app.run(host='0.0.0.0', port=8090, debug=True)
