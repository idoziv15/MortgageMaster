from flask import Blueprint, request, jsonify
from ..services.report_service import find_reports_by_user_id, create_report

report_routes = Blueprint('report_routes', __name__)


@report_routes.route('/reports/<string:user_id>', methods=['GET'])
def get_reports(user_id):
    reports = find_reports_by_user_id(user_id)
    return jsonify(reports), 200


@report_routes.route('/report', methods=['POST'])
def create_report_route():
    report_data = request.get_json()
    report = create_report(report_data)
    return jsonify(report.to_dict()), 201
