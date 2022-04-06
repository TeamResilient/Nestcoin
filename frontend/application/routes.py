from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import time
from flask import render_template, url_for, redirect, request
from application.dummyapi import customapi
import cloudinary
import cloudinary.uploader
from flask_login.utils import logout_user
from werkzeug.security import generate_password_hash
from application.models import CSVExtract, NotificationHistory, User
from application.forms import AddRowForm, RegistrationForm, LoginForm, NotifyTemplate
from application import app, db, bcrypt
from flask_login import login_user, current_user, logout_user, login_required
import smtplib
import os
import csv
import io
from datetime import datetime
from werkzeug.utils import secure_filename
from io import TextIOWrapper
import requests, json
EMAIL_FROM = os.getenv("EMAIL_FROM")
PASSWORD = os.getenv("PASSWORD")
EMAIL_TO = os.getenv("EMAIL_TO")


@app.route("/logout")
def logout():
    logout_user()
    return redirect('/')


@app.route("/account")
@login_required
def account():
    if current_user.is_authenticated:
        return render_template('account.html')
    else:
        return redirect(url_for('login'))


@app.route("/data")
@login_required
def data():
    if current_user.is_authenticated:
        return render_template('data.html', heading='data')
    else:
        return redirect(url_for('login'))


@app.route("/home")
def home():
    if current_user.is_authenticated:
        notif = current_user.history
        day1 = day2 = day3 = day4 = day5 = 0
        for item in notif:
            if (datetime.utcnow() - item.date_time).days == 0:
                day5 += 1
            if (datetime.utcnow() - item.date_time).days == 1:
                day4 += 1
            if (datetime.utcnow() - item.date_time).days == 2:
                day3 += 1
            if (datetime.utcnow() - item.date_time).days == 3:
                day2 += 1
            if (datetime.utcnow() - item.date_time).days == 4:
                day1 += 1
        notifdays = {
            'day5': day5,
            'day4': day4,
            'day3': day3,
            'day2': day2,
            'day1': day1
        }
        data = current_user.data
        return render_template('home.html', notif=len(notif), data=data, notifdays=notifdays, heading='Dashboard')
    else:
        return redirect(url_for('login'))




@app.route("/custom", methods=['GET', 'POST'])
def custom():
    if current_user.is_authenticated:
        print("Ok")
        form = NotifyTemplate()
        if form.validate_on_submit():
            template = form.template.data
            # if(request.files['image']):
            #     uploaded_img = request.files['image']
            #     cloudinary.config(cloud_name="dmcbeyvr4", api_key="641921374166998",
            #                       api_secret="q4zM2BjtuVSux3hKkXpG_SqqcnY")
            #     upload_result = cloudinary.uploader.upload(
            #         uploaded_img, folder="buildathon/")
            #     print(upload_result['secure_url'])
            emails = form.emailid.data.split("; ")
            print(emails)
            notif = NotificationHistory(user_id=current_user.id, email=form.sendmail.data,
                                        message_body=template, scheduled_date=form.scheduled_date.data)
            db.session.add(notif)
            db.session.commit()
            # from twilio.rest import Client
            # account_sid = ACCOUNT_SID
            # auth_token = AUTH_TOKEN
            # client = Client(account_sid, auth_token)
            # if form.sendwhatsappmsg.data:
            #     for mobile_to in mobiles:
            #         print(mobile_to)
            #         if(request.files['image']):
            #             whatsappmessage = client.messages.create(
            #                 from_='whatsapp:'+WHATSAPP_FROM, body=template, media_url=upload_result['secure_url'], to='whatsapp:'+mobile_to)
            #         else:
            #             whatsappmessage = client.messages.create(
            #                 from_='whatsapp:'+WHATSAPP_FROM, body=template, to='whatsapp:'+mobile_to)
            # if form.sendsms.data:
            #     for mobile_to in mobiles:
            #         message = client.messages.create(
            #             body=template,
            #             messaging_service_sid='MG542ab6d1107edc9a4aee705badb89984',
            #             to=mobile_to
            #         )

            
            for email_to in emails:
                server = smtplib.SMTP('smtp.gmail.com', 587)
                server.starttls()
                server.login(EMAIL_FROM, PASSWORD)
                server.sendmail(EMAIL_FROM, email_to, template)
                server.quit()

            return redirect(url_for('home'))
        return render_template('custom.html', form=form, heading='customtrigger')
    else:
        return redirect(url_for('login'))


@app.route("/login", methods=['GET', 'POST'])
@app.route("/", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect('home')
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            return redirect('home')
    return render_template('login.html', form=form)


@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect('home')
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(
            form.password.data).decode('utf-8')
        user = User(username=form.username.data,
                    email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

uploads_dir = os.path.join(app.instance_path, 'uploads/')

@app.route("/upload_csv", methods=['POST'])
def upload_csv():
    if current_user.is_authenticated:
        uploaded_file = request.files['file']
        stream = io.StringIO(
            uploaded_file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.reader(stream)
        for row in csv_input:
            data = CSVExtract(
                name=row[0],
                email=row[1],
                address=row[2],
                amount=row[3],
                user_id=current_user.id,
            )
            db.session.add(data)
            db.session.commit()

        # Uploading the file
        uploaded_file.save(os.path.join(
            uploads_dir, secure_filename(uploaded_file.filename)))

        return redirect(url_for('home'))
    else:
        return redirect(url_for('login'))


@app.route('/clear')
def cleartable():
    if current_user.is_authenticated:
        data = CSVExtract.query.filter_by(user_id=current_user.id).all()
        for row in data:
            db.session.delete(row)
            db.session.commit()
        return redirect(url_for('rewards'))
    else:
        return redirect(url_for('login'))


@app.route('/addrow', methods=['GET', 'POST'])
def addrow():
    if current_user.is_authenticated:
        form = AddRowForm()
        if form.validate_on_submit():
            row = CSVExtract(
                name=form.name.data,
                email=form.email.data,
                address=form.address.data,
                amount=form.amount.data,
                user_id=current_user.id,
            )
            db.session.add(row)
            db.session.commit()
            return redirect(url_for('rewards'))
        return render_template('addrow.html', form=form, heading='rewards')
    else:
        return redirect(url_for('login'))


check = 0





@app.route('/fetchapi', methods=['GET', 'POST'])
def fetchapi():
    if current_user.is_authenticated:
        req = requests.get('http://127.0.0.1:5000/ourapi')
        data1=req.content
        json_data=json.loads(data1)
        #print(json_data)
        for i in json_data['userdata']:
            data = CSVExtract(
                type=i['Type'],
                frequency=i['Frequency'],
                event_date=i['Event Date '],
                due_data=i['Due Data'],
                employee=i['Employee'],
                employee_details=i['Employee Details'],
                event_code=i['Event Code'],
                action_perform=i['Action  to be performed'],
                notification_controller=i['Notification Controller'],
                notification_event=i['Notification Event'],
                user_id=current_user.id,
            )
            db.session.add(data)
            db.session.commit()
        return redirect(url_for('home'))
    else:
        return redirect(url_for('home'))



@app.route("/ourapi")
def runapi():
    return customapi()

@app.route("/wallet")
@login_required
def wallet():
    if current_user.is_authenticated:
        return render_template('wallet.html', heading='wallet')
    else:
        return redirect(url_for('login'))


@app.route("/rewards")
@login_required
def rewards():
    if current_user.is_authenticated:
        data = current_user.data
        return render_template('rewards.html', data=data, heading='rewards')
    else:
        return redirect(url_for('login'))