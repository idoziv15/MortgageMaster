from ..models.report import Report
from pymongo import MongoClient
from bson import ObjectId

client = MongoClient('mongodb+srv://<your-connection-string>')
db = client['your_database']


def find_reports_by_user_id(user_id: str):
    reports = db.reports.find({"user_id": ObjectId(user_id)})
    return [Report(**report).to_dict() for report in reports]


def create_report(report_data: dict) -> Report:
    report_id = db.reports.insert_one(report_data).inserted_id
    return Report(_id=report_id, **report_data)
