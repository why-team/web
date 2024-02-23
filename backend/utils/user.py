# 处理用户相关信息的实用函数

from sqlite3 import Cursor
import uuid
import hashlib
from datetime import datetime, timedelta
from backend.components.database import db2 as db


class User:
    def __init__(self, cursor: Cursor, conn):
        self.conn = conn
    
    # 哈希函数
    def hash_encode(self, t: str):
        hash_object = hashlib.md5()
        hash_object.update(t.encode())
        locked_t = hash_object.hexdigest()
        return locked_t
    
    # 检验用户名是否在数据库中
    def check_username_unique(self, username: str):
        cursor = self.conn.cursor()
        locked_username = self.hash_encode(username)
        sql = "select * from users where username='{}';".format(locked_username)
        db.ping(reconnect=True)
        cursor.execute(sql)
        results = cursor.fetchall()
        if len(results) == 1:
            return True
        else:
            return False
    
    # 登录时匹配用户名和密码是否正确
    def match_username_password(self, username: str, password: str):
        cursor = self.conn.cursor()
        locked_username = self.hash_encode(username)
        locked_password = self.hash_encode(password)
        sql = "select * from users where username='{}' and password='{}';".format(locked_username, locked_password)
        # print(sql)
        db.ping(reconnect=True)
        cursor.execute(sql)
        results = cursor.fetchall()
        if len(results) == 1:
            return True
        else:
            return False

    # 在数据库中添加用户
    def add_user(self, username: str, password: str) -> int:
        cursor = self.conn.cursor()
        locked_username = self.hash_encode(username)
        locked_password = self.hash_encode(password)
        sql = "insert users(username, password) values('{}', '{}');".format(locked_username, locked_password)
        db.ping(reconnect=True)
        cursor.execute(sql)
        self.conn.commit()
        sql = f"select id from users where username='{locked_username}'"
        cursor.execute(sql)
        userid = cursor.fetchall()[0][0]
        return userid
    
    # 用户登录时为其产生token
    def generate_token(self, userid: int):
        cursor = self.conn.cursor()
        sql = f"delete from tokens where userid={userid}"
        db.ping(reconnect=True)
        cursor.execute(sql)
        self.conn.commit()
        # print('deleted')
        token = str(uuid.uuid1())
        token = self.hash_encode(token)
        current_time = datetime.now()
        expire_time = current_time + timedelta(days=7)
        expire_time_str = expire_time.strftime('%Y-%m-%d %H:%M:%S')
        sql = "insert tokens(token, userid, expires_at) values('{}', '{}', '{}');".format(token, userid, expire_time_str)
        cursor.execute(sql)
        self.conn.commit()
        return token

    # 注册用户
    def register(self, username: str, password: str):
        cursor = self.conn.cursor()
        username_have_been_used = self.check_username_unique(username=username)
        if username_have_been_used:
            return {
                'code': 102,
                'msg':'username already used',
            }
        else:
            userid = self.add_user(username=username, password=password)
            token = self.generate_token(userid=userid)
            return {
                'code':101,
                'msg':'register success',
                'token':token,
            }

    # 用户登录
    def login(self, username: str, password: str):
        matched = self.match_username_password(username=username, password=password)
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

    # 检验token有效性
    def validate_token(self, token: str):
        cursor = self.conn.cursor()
        sql = "select expires_at, userid from tokens where token='{}';".format(token)
        db.ping(reconnect=True)
        cursor.execute(sql)
        result = cursor.fetchall()
        print(result)
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
        cursor.execute(sql)
        token = self.generate_token(result[1])
        self.conn.commit()
        return {
            'code': 111,
            'msg': 'valid success',
            'token': token,
        }

    # 修改密码
    def change_password(self, username: str, password: str, new_password: str):
        cursor = self.conn.cursor()
        matched = self.match_username_password(username=username, password=password)
        if matched:
            locked_username = self.hash_encode(username)
            locked_new_password = self.hash_encode(new_password)
            sql = "update users set password = '{}' where username ='{}';".format(locked_new_password, locked_username)
            db.ping(reconnect=True)
            cursor.execute(sql)
            return {
                'code':113,
                'msg':'success',
            }
        else:
            return {
                'code':112,
                'msg':'old password not correct',
            }
    
    # 通过token或username获取用户id
    def get_user_id(self, token: str = None, username: str = None) -> int:
        cursor = self.conn.cursor()
        if token is None and username is None:
            raise ValueError('Provide either token or username')
        if token:
            sql = f'SELECT userid FROM tokens WHERE token="{token}"'
        else:
            username = self.hash_encode(username)
            sql = f'SELECT id FROM users WHERE username="{username}"'
        db.ping(reconnect=True)
        cursor.execute(sql)
        userid = cursor.fetchall()
        # print(sql, userid)
        if len(userid) == 0:
            return -1
        else:
            return userid[0][0]
