from flask_wtf import FlaskForm
from wtforms.fields.core import DateTimeField, SelectField, StringField
from wtforms.fields.simple import PasswordField, SubmitField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, ValidationError
from application.models import User
from flask_wtf.file import FileField, FileAllowed, FileRequired


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[
                           DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])

    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('This username already exists')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember me')
    submit = SubmitField('Sign In')


class NotifyTemplate(FlaskForm):
    scheduled_date = DateTimeField('Scheduled Date', format='%Y-%m-%dT%H:%M')
    template = TextAreaField('Template', validators=[DataRequired()], render_kw={
                             "placeholder": "Message", "rows": "7"})
    emailid = StringField('Email', render_kw={"placeholder": "Email"})
    sendmail = BooleanField('Send mail')
    submit = SubmitField('Send')


class AddRowForm(FlaskForm):
    name = StringField('Name', render_kw={"placeholder": "Name"})
    email = StringField('Email', render_kw={
                            "placeholder": "Email"})
    address = StringField('Contract Address', render_kw={
                             "placeholder": "Contract Address"})
    amount = StringField('Amount', render_kw={"placeholder": "Amount"})
    