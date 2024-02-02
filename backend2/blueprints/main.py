from flask import Blueprint

api_main = Blueprint('api_main', __name__, template_folder='templates')

@api_main.route('/', methods=['POST', 'GET'])
def mainRoute():
    return 'API Server'
