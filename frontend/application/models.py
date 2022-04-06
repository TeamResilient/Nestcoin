from application import db, login_manager
from flask_login import UserMixin
from datetime import datetime


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True,nullable=False)
    email = db.Column(db.String(120), unique=True,nullable=False)
    image_file = db.Column(db.String(20),nullable=False,default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    history = db.relationship('NotificationHistory',backref='author',lazy=True)
    data = db.relationship('CSVExtract',backref='author',lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}' , '{self.image_file}')"


class NotificationHistory(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    scheduled_date = db.Column(db.DateTime, default = datetime.utcnow)
    message_body = db.Column(db.String(500),nullable=False)
    email = db.Column(db.Boolean,default=False,nullable=False)
    date_time = db.Column(db.DateTime,nullable = False, default = datetime.utcnow)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)

    def __repr__(self):
        return f"NotificationHistory('{self.id}')"


class CSVExtract(db.Model,UserMixin):
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    name = db.Column(db.String(25))
    email = db.Column(db.String(25), nullable=True)
    address = db.Column(db.String(500), nullable=False, primary_key=True)
    amount = db.Column(db.Integer(), nullable=True)

    def __repr__(self):
        return f"CSV('{self.user_id}', '{self.name}', , '{self.address}')"

def init_db():
    db.create_all()


if __name__ == '__main__':
    init_db()