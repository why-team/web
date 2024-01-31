from sqlite3 import Cursor
import uuid
import hashlib
from datetime import datetime, timedelta

class User():
    def __init__(self, cursor: Cursor):
        self.cursor = cursor
    
    def hash_encode(self, t: str):
        hash_object = hashlib.md5()
        hash_object.update(t.encode())
        locked_t = hash_object.hexdigest()
        return locked_t
    
    def check_username_unique(self, username: str):
        locked_username = self.hash_encode(username)
        sql = "select * from users where username='{}';".format(locked_username)
        self.cursor.execute(sql)
        results = self.cursor.fetchall()
        if len(results) == 1:
            return True
        else:
            return False
    
    def match_username_password(self, username: str, password: str):
        locked_username = self.hash_encode(username)
        locked_password = self.hash_encode(password)
        sql = "select * from users where username='{}' and password='{}';".format(locked_username,locked_password)
        # print(sql)
        self.cursor.execute(sql)
        results = self.cursor.fetchall()
        if len(results) == 1:
            return True
        else:
            return False

    def add_user(self, username: str, password: str) -> int:
        locked_username = self.hash_encode(username)
        locked_password = self.hash_encode(password)
        sql = "insert users(username, password) values('{}', '{}');".format(locked_username,locked_password)
        self.cursor.execute(sql)
        sql = f"select id from users where username='{locked_username}'"
        self.cursor.execute(sql)
        userid = self.cursor.fetchall()[0][0]
        return userid
    
    def generate_token(self, userid: int):
        token = str(uuid.uuid1())
        token = self.hash_encode(token)
        current_time = datetime.now()
        expire_time = current_time + timedelta(days=7)
        expire_time_str = expire_time.strftime('%Y-%m-%d %H:%M:%S')
        sql = "insert tokens(token, userid, expires_at) values('{}', '{}', '{}');".format(token, userid, expire_time_str)
        self.cursor.execute(sql)
        return token
        
    def register(self, username: str, password: str):
        username_have_been_used = self.check_username_unique(username=username)
        if username_have_been_used:
            return {
                'code':102,
                'msg':'username already used',
            }
        else:
            userid = self.add_user(username=username,password=password)
            token = self.generate_token(userid=userid)
            return {
                'code':101,
                'msg':'register success',
                'token':token,
            }

    def login(self, username: str, password: str):
        matched = self.match_username_password(username=username,password=password)
        if matched:
            userid = self.get_user_id(username=username)
            token = self.generate_token(userid=userid)
            return {
                    'code':100,
                    'msg':'login success',
                    'token':token,
                }
        else:
            if not self.check_username_unique(username=username):
                return {
                    'code':109,
                    'msg':'username not exist'
                }
            else:
                return {
                    'code':103,
                    'msg':'password error'
                }

    def validate_token(self, token: str):
        sql = "select expires_at, userid from tokens where token='{}';".format(token)
        self.cursor.execute(sql)
        result = self.cursor.fetchall()
        if len(result) == 0:
            return {
                'code': 110,
                'msg': 'invalid token',
            }
        result = result[0]
        
        if result[0] < datetime.now():
           return {
                'code': 112,
                'msg': 'token has expired'
            }

        sql = "delete from tokens where token='{}';".format(token)
        self.cursor.execute(sql)
        token = self.generate_token(result[1])
        return {
            'code': 111,
            'msg': 'valid success',
            'token': token,
        }
        
    def change_password(self, username: str, password: str, new_password: str):
        matched = self.match_username_password(username=username,password=password)
        if matched:
            locked_username = self.hash_encode(username)
            locked_new_password = self.hash_encode(new_password)
            sql = "update users set password = '{}' where username ='{}';".format(locked_new_password,locked_username)
            self.cursor.execute(sql)
            return {
                'code':113,
                'msg':'success',
            }
        else:
            return {
                'code':112,
                'msg':'old password not correct',
            }
    
    def get_user_id(self, token: str = None, username: str = None) -> int:
        if token is None and username is None:
            raise ValueError('Provide either token or username')
        if token:
            sql = f'SELECT userid FROM tokens WHERE token="{token}"'
        else:
            sql = f'SELECT id FROM users WHERE username="{username}"'
        self.cursor.execute(sql)
        userid = self.cursor.fetchall()
        if len(userid) == 0:
            return -1
        else:
            return userid[0]
