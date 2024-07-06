import datetime
import uuid

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


@app.route('/reports/<int:user_id>', methods=['GET'])
def get_user_reports(user_id):
    user_reports = [report for report in reports if report['user_id'] == user_id]

    if user_reports:
        return jsonify({'reports': user_reports}), 200

    return jsonify({'error': 'No reports found for this user'}), 404


# Route to handle saving reports
@app.route('/report/<int:user_id>', methods=['POST'])
def save_report(user_id):
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
            'user_id': user_id,
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
def delete_report(report_id):
    try:
        # Get the user ID from the request body
        request_data = request.get_json()
        user_id = request_data.get('userId')

        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        # Find the report to delete
        report = next((r for r in reports if r['id'] == report_id and r['user_id'] == user_id), None)
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
