import datetime
import uuid
from functools import wraps

import bcrypt
import jwt
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from BMM.business_models.model import BMM
from DB.test1.reports import reports
from DB.test1.users import users
from datetime import datetime, timedelta

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
# Secret key for JWT encoding/decoding
SECRET_KEY = app.config['SECRET_KEY']
blacklist = set()


# JWT token required decorator
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        if token in blacklist:
            return jsonify({'message': 'Token is invalid'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = find_user_by_id(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)

    return decorator


@app.route('/login', methods=['POST'])
def login():
    try:
        # Get data from request JSON body
        req = request.get_json()
        email = req.get('email')
        password = req.get('password')

        # Find the user by email
        user = find_user_by_email(email)
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            # Create JWT token
            token = jwt.encode({
                'user_id': user['id'],
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, SECRET_KEY, algorithm='HS256')
            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401

    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({'error': 'Failed to login'}), 500


@app.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    try:
        token = request.headers.get('Authorization').split()[1]
        blacklist.add(token)
        return jsonify({'message': 'Logged out successfully'}), 200

    except Exception as e:
        print(f"Error logging out: {e}")
        return jsonify({'error': 'Failed to logout'}), 500


@app.route('/verify-token', methods=['POST'])
def verify_token():
    token = request.headers.get('Authorization').split()[1]
    # check if token in the server's black list
    if token in blacklist:
        return jsonify({'valid': False}), 401

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        current_user = find_user_by_id(data['user_id'])
        if current_user:
            return jsonify({'valid': True}), 200
        else:
            return jsonify({'valid': False}), 401
    except:
        return jsonify({'valid': False}), 401


@app.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    try:
        req = request.get_json()
        current_password = req.get('currentPassword')
        new_password = req.get('newPassword')

        # Validate current password
        if not current_user['password'] != current_password:
            return jsonify({'error': 'Current password is incorrect'}), 401

        # Update user's password
        current_user['password'] = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        # Revoke current session token
        blacklist.add(request.headers.get('Authorization').split()[1])

        # Respond with success message
        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        print(f"Error changing password: {e}")
        return jsonify({'error': 'Failed to change password'}), 500


@app.route('/users', methods=['GET', 'POST'])
@token_required
def user_routes(current_user):
    if request.method == 'GET':
        users = Users.query.all()
        user_list = [{'id': user.id, 'username': user.name, 'email': user.email} for user in users]
        return jsonify({'users': user_list})
    elif request.method == 'POST':
        data = request.json
        new_user = Users(name=data['username'], email=data['email'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201


# @app.route('/dashboard/bmm', methods=['POST'])
# def analyse_investment():
#     data = request.json
#     investment_data = data['investment_data']
#     investor_data = data['investor_data']
#     property_data = data['property_data']
#     mortgage_data = data['mortgage_data']
#     other_data = data['other_data']
#     result = BMM(investment_data, investor_data, property_data, mortgage_data, other_data).calculate_insights()
#     return jsonify({'insights': result}), 200


@app.route('/dashboard/bmm_update', methods=['PUT'])
@token_required
def update_investment(current_user):
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
@token_required
def get_report(current_user, id):
    for report in reports:
        if report['id'] == id:
            return jsonify({'report': report}), 200

    return jsonify({'error': 'Report not found'}), 404


@app.route('/reports', methods=['GET'])
@token_required
def get_user_reports(user):
    user_reports = [report for report in reports if report['user_id'] == user['id']]
    if user_reports:
        return jsonify({'reports': user_reports}), 200

    return jsonify({'error': 'No reports found for this user'}), 404


# Route to handle saving reports
@app.route('/report', methods=['POST'])
@token_required
def save_report(user):
    try:
        # Get data from request JSON body
        request_data = request.get_json()
        # Extract report details
        name = request_data.get('name')
        description = request_data.get('description')
        data = request_data.get('data')

        # Process and save report data
        reports.append({
            'id': str(uuid.uuid4()),
            'user_id': user.id,
            'name': name,
            'description': description,
            'data': data
        })

        # Respond with success message
        return jsonify({'message': 'Report saved successfully'}), 200

    except Exception as e:
        print(f"Error saving report: {e}")
        # Respond with error message
        return jsonify({'error': 'Failed to save report'}), 500


# Route to handle deleting reports
@app.route('/investment_report/<report_id>', methods=['DELETE'])
@token_required
def delete_report(current_user, report_id):
    try:
        # Get the user ID from the request body
        user_id = current_user['id']

        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        # Find the report to delete
        report = next((r for r in reports if r['id'] == int(report_id) and r['user_id'] == int(user_id)), None)
        if report:
            # Remove the report from the list
            reports.remove(report)
            return jsonify({'message': 'Report deleted successfully'}), 200
        else:
            return jsonify({'error': 'Report not found or user not authorized'}), 404
    except Exception as e:
        print(f"Error deleting report: {e}")
        return jsonify({'error': 'Failed to delete report'}), 500


@app.route('/investment_report/<int:report_id>', methods=['PUT'])
@token_required
def update_report(current_user, report_id):
    data = request.json
    for report in reports:
        if report['id'] == report_id:
            report['name'] = data.get('name', report['name'])
            report['description'] = data.get('description', report['description'])
            report['lastUpdated'] = datetime.utcnow()
            return jsonify({'report': report}), 200
    return jsonify({'error': 'Report not found'}), 404


# Helper function to find a user by ID
def find_user_by_id(user_id):
    return next((user for user in users if user['id'] == user_id), None)


# Helper function to find a user by email
def find_user_by_email(email):
    return next((user for user in users if user['email'] == email), None)


@app.route('/register', methods=['POST'])
def create_user():
    try:
        # Get data from request
        req = request.get_json()
        first_name = req.get('firstName')
        last_name = req.get('lastName')
        email = req.get('email')
        password = req.get('password')
        registered_date = datetime.now().isoformat()

        # Check if user already exists
        if find_user_by_email(email):
            return jsonify({'message': 'User already exists'}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create new user
        new_user = {
            'id': len(users) + 1,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': hashed_password.decode('utf-8'),
            'registered_date': registered_date
        }
        users.append(new_user)

        # Respond with the new user
        return jsonify(new_user), 201

    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({'error': 'Failed to create user'}), 500


@app.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    try:
        if current_user:
            # Create a dictionary copy of the current_user object
            user_data = {
                'id': current_user['id'],
                'first_name': current_user['first_name'],
                'last_name': current_user['last_name'],
                'email': current_user['email'],
                'date_added': current_user['registered_date']
            }
            return jsonify(user_data), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Error retrieving user: {e}")
        return jsonify({'error': 'Failed to retrieve user'}), 500


@app.route('/users', methods=['PUT'])
@token_required
def update_user(current_user):
    try:
        user = find_user_by_id(current_user.id)
        if user:
            req = request.get_json()
            user['first_name'] = req.get('firstName', user['firstName'])
            user['last_name'] = req.get('lastName', user['lastName'])
            user['email'] = req.get('email', user['email'])
            if 'password' in req:
                user['password'] = bcrypt.hashpw(req['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            return jsonify(user), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({'error': 'Failed to update user'}), 500


@app.route('/users', methods=['DELETE'])
@token_required
def delete_user(current_user):
    try:
        user = find_user_by_id(current_user.id)
        if user:
            users.remove(user)
            return jsonify({'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({'error': 'Failed to delete user'}), 500


@app.route('/')
def index():
    # Return a simple message
    return jsonify({'message': 'Welcome to the API!'})


if __name__ == '__main__':
    # Create all database tables
    # db.create_all()
    app.run(debug=True)
