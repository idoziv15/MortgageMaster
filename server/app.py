import datetime
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from BMM.business_models.model import BMM
from DB.test1.reports import reports
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Configure MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy Database
db = SQLAlchemy(app)

# Enable CORS for the Flask app
CORS(app)


# Define User model
class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(45), nullable=False)
    last_name = db.Column(db.String(45), nullable=False)
    email = db.Column(db.String(45), unique=True, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow())

    def __init__(self, name, email):
        self.name = name
        self.email = email


# API routes
@app.route('/users', methods=['GET', 'POST'])
def user_routes():
    if request.method == 'GET':
        # Handle GET request for users
        users = Users.query.all()
        print(users)
        user_list = []
        for user in users:
            user_list.append({'id': user.id, 'username': user.name, 'email': user.email})
        return jsonify({'users': user_list})
    elif request.method == 'POST':
        # Handle POST request for creating a new user
        data = request.json
        new_user = Users(name=data['username'], email=data['email'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201


@app.route('/dashboard/bmm', methods=['POST'])
def analyse_investment():
    data = request.json
    investment_data = data['investment_data']
    investor_data = data['investor_data']
    property_data = data['property_data']
    mortgage_data = data['mortgage_data']
    other_data = data['other_data']
    result = BMM(investment_data, investor_data, property_data, mortgage_data, other_data).calculate_insights()
    return jsonify({'insights': result}), 200


@app.route('/dashboard/bmm_update', methods=['PUT'])
def update_investment():
    data = request.json
    investment_data = data['investment_data']
    investor_data = data['investor_data']
    property_data = data['property_data']
    mortgage_data = data['mortgage_data']
    other_data = data['other_data']
    result = BMM(investment_data, investor_data, property_data, mortgage_data, other_data).calculate_insights()
    print(result)
    return jsonify({'insights': result}), 200


@app.route('/report/<int:id>', methods=['GET'])
def get_report(id):
    for report in reports:
        if report['id'] == id:
            return jsonify({'report': report}), 200

    return jsonify({'error': 'Report not found'}), 404


@app.route('/investment_report/<int:report_id>', methods=['PUT'])
def update_report(report_id):
    data = request.json
    for report in reports:
        if report['id'] == report_id:
            report['name'] = data.get('name', report['name'])
            report['description'] = data.get('description', report['description'])
            report['lastUpdated'] = datetime.utcnow()
            return jsonify({'report': report}), 200
    return jsonify({'error': 'Report not found'}), 404


@app.route('/')
def index():
    # Return a simple message
    return jsonify({'message': 'Welcome to the API!'})


if __name__ == '__main__':
    # Create all database tables
    # db.create_all()
    app.run(debug=True)
