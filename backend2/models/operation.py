from datetime import datetime
from flask import request

from backend2.app import db
from backend2.utils.user import User

user = User()


class Operation(db.Model):
    __tablename__ = 'Operations'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    op_type = db.Column(db.Integer, nullable=False)
    op_type2 = db.Column(db.Integer, nullable=False)
    op_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, nullable=False)
    ip = db.Column(db.String(40), nullable=False)
    user_agent = db.Column(db.String(255), nullable=False)
    article_id = db.Column(db.Integer)
    dest_user = db.Column(db.Integer)
    details = db.Column(db.Text(255))

    def __init__(self,
                 op_type: int,
                 op_type2: int,
                 user_id: int,
                 ip: str,
                 user_agent: str,
                 op_time: int = datetime.utcnow(),
                 article_id: int = None,
                 dest_user: int = None,
                 details: str = None):
        self.op_type = op_type
        self.op_type2 = op_type2
        self.op_time = op_time
        self.user_id = user_id
        self.ip = ip
        self.user_agent = user_agent
        self.article_id = article_id
        self.dest_user = dest_user
        self.details = details


def add_operation(token: str,
                  op_type: int,
                  op_type2: int,
                  article_id: int = None,
                  dest_user: int = None,
                  details: str = None):
    if op_type == 1 and op_type2 == 0 and article_id == None:
        raise ValueError('Param "article_id" is required.')
    elif op_type == 1 and op_type2 == 1 and details == None:
        raise ValueError('Param "details" is required.')
    elif op_type == 2 and (op_type2 == 0 or op_type2 == 1) and article_id == None:
        raise ValueError('Param "article_id" is required.')
    user_id = user.get_user_id(token=token)
    ip = request.remote_addr
    user_agent = request.user_agent.string
    operation = Operation(op_type=op_type,
                          op_type2=op_type2,
                          user_id=user_id,
                          ip=ip,
                          user_agent=user_agent,
                          dest_user=dest_user,
                          details=details,
                          article_id=article_id)
    try:
        db.session.add(operation)
    except:
        db.session.rollback()
        return -1
    db.session.commit()
    return 0
