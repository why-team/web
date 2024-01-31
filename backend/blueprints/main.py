from flask import Blueprint, redirect

api_main = Blueprint('api_main', __name__, template_folder='templates')

@api_main.route('/', methods=['POST', 'GET'])
def mainRedirect():
    return redirect('/api/search')