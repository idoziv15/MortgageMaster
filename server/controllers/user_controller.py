from flask import Blueprint, request, jsonify
from ..services.user_service import find_user_by_id, create_user

user_routes = Blueprint('user_routes', __name__)


@user_routes.route('/user/<string:user_id>', methods=['GET'])
def get_user(user_id):
    user = find_user_by_id(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "User not found"}), 404


@user_routes.route('/user', methods=['POST'])
def create_user_route():
    user_data = request.get_json()
    user = create_user(user_data)
    return jsonify(user.to_dict()), 201
