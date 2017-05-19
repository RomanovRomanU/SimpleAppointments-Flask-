from flask import Flask
from flask import render_template,request,redirect,session,url_for
from flask_pymongo import PyMongo
# Function for proper handling of MongoDB ID type
from bson.objectid import ObjectId
app = Flask(__name__)
app.debug = True
# As db I use MongoDB
mongo = PyMongo(app)

# Create default user in database
@app.route('/register')
def register():
    mongo.db.users.update(
        {'username': "admin"},
        {'$set': {'password': '1111'}},
        upsert=True
    )
    return '''Login: admin Password:1111'''

# Creating session for user in database
@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        form = request.form
        username = form.get('username')
        password = form.get('password')
        # Check,if
        login_search = mongo.db.users.find({'username':username,'password':password})
        if login_search.count():
            session['username'] = username
            return redirect(url_for('dashboard'))
        else:
            return redirect(url_for('login'))

@app.route('/logout')
def logout():
    print(session)
    session.pop('username', None)
    return redirect(url_for('index'))

# Dashboard of logged user
# Where he can create new appointment
# and view all filled forms


@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        filled_forms = mongo.db.appointmentsRegister.find()
        return render_template('dashboard.html',username = session['username'],filledForms = filled_forms)
    return redirect(url_for('login'))

# Route for posting new appointment form to database 
@app.route('/appointment',methods = ['POST'])
def appointment():
    form = request.form
    # Making dictionary with form values
    appointment = dict()
    for key in form:
        appointment[key] = form[key]
    appointment['data_ranges'] = int(form['data_ranges'])
    #Adding appointment to our db
    mongo.db.appointments.insert(appointment)
    return None

# Route for rendering all appointments in database
@app.route('/')
def index():
    #Find all appointments in db
    appointments = mongo.db.appointments.find()
    username = None
    if 'username' in session:
        username = session['username']
    return render_template('index.html',appointments = appointments,username = username)

# Route for appointment form page
# As unique <id> for each appointment I use
# MongoDB ObjectId(converted to string)
@app.route('/appointments/<id>')
def appointment_page(id):
    # Cursor for find appointment
    appointment = mongo.db.appointments.find({'_id':ObjectId(id)})
    # Appointment value 
    appointment = appointment[0]
    return render_template('appointment.html',appointment=appointment)

app.secret_key = 'sdkfglure1HYDn12hfub'

# Route for recieving filled appointment form from user
@app.route('/appointmentRegister',methods=['POST'])
def appointment_register():
    form = request.form
    appointment = dict()
    for key in form:
        appointment[key] = form[key]
    mongo.db.appointmentsRegister.insert(appointment)
    return 'Appointment was added'
if __name__ == '__main__':
    app.run()