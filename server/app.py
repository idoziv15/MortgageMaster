import datetime
import traceback
from functools import wraps
import bcrypt
import jwt
from flask import Flask, request, jsonify, make_response, render_template
from dotenv import load_dotenv
import os
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from BMM.business_models.model import BMM
from datetime import datetime, timedelta
import pdfkit

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Configure Mongo database
app.config['MONGO_URI'] = os.getenv('MONGO_URI')

# Initialize PyMongo for MongoDB
mongo = PyMongo(app)

# Enable CORS for the Flask app
CORS(app)

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
        except Exception as e:
            print(f"Error: {e}")
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
                'user_id': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(days=1)
            }, SECRET_KEY, algorithm='HS256')
            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401

    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({'error': 'Failed to login'}), 500


@app.route('/login/google', methods=['POST'])
def login_google():
    try:
        token = request.json['token']
        # id_info = id_token.verify_oauth2_token(token, requests.Request(), 'YOUR_GOOGLE_CLIENT_ID')
        return jsonify({'message': 'Google login unavailable right now'}), 400

        # Check if user exists in your DB, if not create them
        user = mongo.db.users.find_one({"email": id_info['email']})
        if not user:
            user = {
                'first_name': id_info['given_name'],
                'last_name': id_info['family_name'],
                'email': id_info['email'],
                'registered_date': datetime.utcnow(),
            }
            mongo.db.users.insert_one(user)

        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(days=1)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({'token': token}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Google login failed'}), 400


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
    except Exception as e:
        print(f"Error changing password: {e}")
        return jsonify({'valid': False}), 401


@app.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    try:
        req = request.get_json()
        current_password = req.get('currentPassword')
        new_password = req.get('newPassword')

        # Fetch the user from MongoDB by their ID
        user = mongo.db.users.find_one({'_id': current_user['_id']})

        if user:
            # Validate the current password
            if not bcrypt.checkpw(current_password.encode('utf-8'), user['password'].encode('utf-8')):
                return jsonify({'error': 'Current password is incorrect'}), 401

            # Hash the new password
            hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Update user's password in MongoDB
            mongo.db.users.update_one({'_id': current_user['_id']}, {'$set': {'password': hashed_new_password}})

            # Revoke current session token by adding it to the blacklist
            blacklist.add(request.headers.get('Authorization').split()[1])

            # Respond with success message
            return jsonify({'message': 'Password changed successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        print(f"Error changing password: {e}")
        return jsonify({'error': 'Failed to change password'}), 500


@app.route('/users', methods=['GET', 'POST'])
@token_required
def user_routes(current_user):
    if request.method == 'GET':
        # Fetch all users from the MongoDB "users" collection
        users = mongo.db.users.find()
        user_list = [{'id': str(user['_id']), 'first_name': user['first_name'], 'last_name': user['last_name'],
                      'email': user['email']} for user in users]
        return jsonify({'users': user_list}), 200

    elif request.method == 'POST':
        try:
            data = request.json
            # Create a new user document in MongoDB
            new_user = {
                'first_name': data['firstName'],
                'last_name': data['lastName'],
                'email': data['email'],
                'password': bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                # Hash the password
                'registered_date': datetime.utcnow()
            }

            # Insert the new user into the MongoDB "users" collection
            mongo.db.users.insert_one(new_user)
            return jsonify({'message': 'User created successfully'}), 201
        except Exception as e:
            print(f"Error creating user: {e}")
            return jsonify({'error': 'Failed to create user'}), 500

@app.route('/bmm', methods=['PUT'])
@token_required
def calculate_BMM(current_user):
    try:
        data = request.json
        # print(data)
        investment_data = data['investment_data']
        investor_data = data['investor_data']
        property_data = data['property_data']
        mortgage_data = data['mortgage_data']
        # for t in data['mortgage_data']:
        #     print("This is track:")
        #     print(t)
        #     print('')
        other_data = data['other_data']
        # print(investor_data)
        result = BMM(investment_data, investor_data, property_data, mortgage_data, other_data).calculate_insights()
        # print(result)
        return jsonify({'insights': result}), 200

    except Exception as e:
        print(f"Error calculating BMM: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to calculate BMM'}), 500


@app.route('/report/<string:report_id>', methods=['GET'])
@token_required
def get_report(current_user, report_id):
    try:
        # Fetch report from MongoDB by its ObjectId
        report = mongo.db.reports.find_one({"_id": ObjectId(report_id)})
        if report:
            return jsonify({'report': serialize_report(report)}), 200
        else:
            return jsonify({'error': 'Report not found'}), 404

    except Exception as e:
        print(f"Error fetching report: {e}")
        return jsonify({'error': 'Failed to fetch report'}), 500


def serialize_report(report):
    # Convert the ObjectId to a string for JSON serialization
    report['_id'] = str(report['_id'])
    report['user_id'] = str(report['user_id'])
    return report


@app.route('/reports', methods=['GET'])
@token_required
def get_user_reports(current_user):
    try:
        # Fetch all reports for the current user from MongoDB
        user_reports = mongo.db.reports.find({"user_id": ObjectId(current_user['_id'])})
        reports_list = [serialize_report(report) for report in user_reports]

        if reports_list:
            return jsonify({'reports': reports_list}), 200
        else:
            return jsonify({'error': 'No reports found for this user'}), 404

    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({'error': 'Failed to fetch reports'}), 500


# Route to handle saving reports
@app.route('/report', methods=['POST'])
@token_required
def save_report(current_user):
    try:
        # Get data from request JSON body
        request_data = request.get_json()

        # Create report document
        new_report = {
            'user_id': current_user['_id'],
            'name': request_data.get('name'),
            'description': request_data.get('description'),
            'data': request_data.get('data'),
            'created_at': datetime.utcnow()
        }

        # Save the new report into "reports" collection
        mongo.db.reports.insert_one(new_report)

        # Respond with success message
        return jsonify({'message': 'Report saved successfully'}), 200

    except Exception as e:
        print(f"Error saving report: {e}")
        return jsonify({'error': 'Failed to save report'}), 500


# Route to handle deleting reports
@app.route('/investment_report/<string:report_id>', methods=['DELETE'])
@token_required
def delete_report(current_user, report_id):
    try:
        # Find the report to delete
        result = mongo.db.reports.delete_one({
            '_id': ObjectId(report_id),
            'user_id': current_user['_id']
        })

        if result.deleted_count > 0:
            return jsonify({'message': 'Report deleted successfully'}), 200
        else:
            return jsonify({'error': 'Report not found or user not authorized'}), 404

    except Exception as e:
        print(f"Error deleting report: {e}")
        return jsonify({'error': 'Failed to delete report'}), 500


@app.route('/report/<string:report_id>', methods=['PUT'])
@token_required
def update_report(current_user, report_id):
    try:
        report_data = request.json
        # Fetch report from DB
        report = mongo.db.reports.find_one({"_id": ObjectId(report_id)})

        if report:
            # Update existing report
            updated_data = {
                "name": report_data.get("name", report.get("name")),
                "description": report_data.get("description", report.get("description")),
                "data": report_data.get("data", report.get("data"))
            }

            # Perform the update in MongoDB
            mongo.db.reports.update_one(
                {"_id": ObjectId(report_id)},
                {"$set": updated_data}
            )

            return jsonify({'message': 'Report updated successfully'}), 200
        else:
            return jsonify({'error': 'Report not found'}), 404

    except Exception as e:
        print(f"Error saving report: {e}")
        return jsonify({'error': 'Failed to save report'}), 500


@app.route('/investment_report/<string:report_id>', methods=['PUT'])
@token_required
def update_report_details(current_user, report_id):
    try:
        data = request.get_json()

        # Find and update the report
        result = mongo.db.reports.update_one(
            {"_id": ObjectId(report_id), "user_id": current_user['_id']},  # Ensure the user owns the report
            {"$set": {
                "name": data.get('name'),
                "description": data.get('description'),
                "lastUpdated": datetime.utcnow()
            }}
        )

        if result.modified_count > 0:
            return jsonify({'message': 'Report updated successfully'}), 200
        else:
            return jsonify({'error': 'Report not found or user not authorized'}), 404

    except Exception as e:
        print(f"Error updating report: {e}")
        return jsonify({'error': 'Failed to update report'}), 500


def find_user_by_id(user_id):
    try:
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        print(f"Error finding user by id: {e}")
        return None


def find_user_by_email(email):
    return mongo.db.users.find_one({"email": email})


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
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': hashed_password.decode('utf-8'),
            'registered_date': registered_date
        }

        # Save the new user into Users collection
        result = mongo.db.users.insert_one(new_user)

        # Convert ObjectId to string for JSON serialization
        new_user['_id'] = str(result.inserted_id)

        # Respond with the new user
        return jsonify({'message': 'User created successfully', 'user': new_user}), 201

    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({'error': 'Failed to create user'}), 500


@app.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    try:
        if current_user:
            return jsonify({
                'id': str(current_user['_id']),
                'first_name': current_user['first_name'],
                'last_name': current_user['last_name'],
                'email': current_user['email'],
                'date_added': current_user['registered_date']
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Error retrieving user: {e}")
        return jsonify({'error': 'Failed to retrieve user'}), 500


@app.route('/users/<string:user_id>', methods=['PUT'])
@token_required
def update_user(current_user, user_id):
    try:
        req = request.get_json()
        updates = {
            "first_name": req.get('first_name', current_user['first_name']),
            "last_name": req.get('last_name', current_user['last_name']),
            "email": req.get('email', current_user['email'])
        }

        if 'password' in req:
            updates['password'] = bcrypt.hashpw(req['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Update user in MongoDB
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )

        if result.modified_count > 0:
            return jsonify({'message': 'User updated successfully'}), 200
        else:
            return jsonify({'message': 'No changes were made'}), 200

    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({'error': 'Failed to update user'}), 500


@app.route('/users', methods=['DELETE'])
@token_required
def delete_user(current_user):
    try:
        # Delete all reports for this user
        reports_result = mongo.db.reports.delete_many({"user_id": current_user['_id']})
        if reports_result.deleted_count == 0:
            print("No reports found for the user, continuing with user deletion.")
        elif reports_result.acknowledged:
            print(f"Deleted {reports_result.deleted_count} report(s) successfully.")
        else:
            return jsonify({'error': 'Failed to delete user'}), 500

        # Delete the user from MongoDB
        result = mongo.db.users.delete_one({"_id": current_user['_id']})

        if result.deleted_count > 0:
            return jsonify({'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({'error': 'Failed to delete user'}), 500


@app.route('/report/<string:report_id>/download', methods=['GET'])
@token_required
def download_report(current_user, report_id):
    try:
        # Ensure the report_id is valid
        if not ObjectId.is_valid(report_id):
            return jsonify({'error': 'Invalid report ID'}), 400

        # Fetch the report data
        report = mongo.db.reports.find_one({"_id": ObjectId(report_id)})
        if not report:
            return jsonify({'error': 'Report not found'}), 404

        # Generate HTML content for the PDF
        print(report['data']['mortgageTracks'])
        html_content = render_template(
            "report_template.html",
            report_name=report['name'],
            report_description=report['description'],
            created_at=report['created_at'].strftime('%Y-%m-%d %H:%M:%S'),
            investmentData=report['data']['investmentData'],
            investorData=report['data']['investorData'],
            propertyData=report['data']['propertyData'],
            mortgageData=report['data']['mortgageTracks'],
            otherData=report['data']['otherData'],
            insightsData=report['data']['insightsData'],
            current_year=datetime.now().year
        )

        # Generate PDF using pdfkit
        pdf = pdfkit.from_string(html_content, False)

        # Send the PDF as a downloadable file
        response = make_response(pdf)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename={report_id}.pdf'

        return response

    except Exception as e:
        print(f"Error generating PDF: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to generate PDF'}), 500


def serialize_task(task):
    return {
        'id': str(task['_id']),
        'content': task.get('content'),
        'completed': task.get('completed', False)
    }


@app.route('/tasks', methods=['GET'])
@token_required
def get_user_tasks(current_user):
    try:
        tasks = mongo.db.tasks.find({"user_id": str(current_user["_id"])})
        tasks_list = [serialize_task(task) for task in tasks]
        return jsonify({'tasks': tasks_list}), 200
    except Exception as e:
        print(f"Error fetching tasks: {e}")
        return jsonify({'error': 'Failed to fetch tasks'}), 500


@app.route('/tasks', methods=['POST'])
@token_required
def save_task(current_user):
    try:
        data = request.json
        new_task = {
            'user_id': str(current_user["_id"]),
            'content': data.get('content'),
            'completed': data.get('completed', False)
        }
        result = mongo.db.tasks.insert_one(new_task)
        new_task['_id'] = str(result.inserted_id)

        return jsonify(new_task), 201
    except Exception as e:
        print(f"Error saving task: {e}")
        return jsonify({'error': 'Failed to save task'}), 500


@app.route('/tasks/<string:task_id>', methods=['PUT'])
@token_required
def edit_task(current_user, task_id):
    try:
        data = request.json
        updated_task = {
            'content': data.get('content'),
            'completed': data.get('completed', False)
        }
        result = mongo.db.tasks.update_one(
            {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])},
            {"$set": updated_task}
        )
        if result.matched_count:
            return jsonify({'message': 'Task updated successfully'}), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        print(f"Error updating task: {e}")
        return jsonify({'error': 'Failed to update task'}), 500


@app.route('/task/<string:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    try:
        result = mongo.db.tasks.delete_one(
            {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])}
        )
        if result.deleted_count:
            return jsonify({'message': 'Task deleted successfully'}), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        print(f"Error deleting task: {e}")
        return jsonify({'error': 'Failed to delete task'}), 500


@app.route('/tasks', methods=['DELETE'])
@token_required
def delete_all_tasks(current_user):
    try:
        result = mongo.db.tasks.delete_many({"user_id": str(current_user["_id"])})
        return jsonify({'message': f'{result.deleted_count} tasks deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting all tasks: {e}")
        return jsonify({'error': 'Failed to delete all tasks'}), 500


@app.route('/tasks/delete-selected', methods=['POST'])
@token_required
def delete_selected_tasks(current_user):
    try:
        data = request.json
        task_ids = data.get('taskIds', [])
        result = mongo.db.tasks.delete_many({
            "_id": {"$in": [ObjectId(task_id) for task_id in task_ids]},
            "user_id": str(current_user["_id"])
        })
        return jsonify({'message': f'{result.deleted_count} tasks deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting selected tasks: {e}")
        return jsonify({'error': 'Failed to delete selected tasks'}), 500


@app.route('/tasks/<string:task_id>/completion', methods=['PUT'])
@token_required
def update_task_completion(current_user, task_id):
    try:
        data = request.json
        completed = data.get('completed', False)
        result = mongo.db.tasks.update_one(
            {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])},
            {"$set": {'completed': completed}}
        )
        if result.matched_count:
            return jsonify({'message': 'Task completion status updated successfully'}), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        print(f"Error updating task completion status: {e}")
        return jsonify({'error': 'Failed to update task completion status'}), 500


if __name__ == '__main__':
    app.run(debug=True)
