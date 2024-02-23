from flask_sqlalchemy import SQLAlchemy
import pymysql

db = SQLAlchemy()
dbhost='localhost'
dbuser='root'
dbpass='admin'
dbname='testtest'
db2 = pymysql.connect(host=dbhost,user=dbuser,password=dbpass,database=dbname)
