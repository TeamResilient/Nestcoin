from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail

from dotenv import load_dotenv
load_dotenv()



app = Flask(__name__)
app.config['SECRET_KEY'] = '25ee72345d734f45995acb78f8114c37'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
bcrypt = Bcrypt(app)
login_manager.login_view='login'
login_manager.login_message_category='info'


if __name__ == '__main__':
    db.create_all()
    print('after db.create_all()')
from application import routes