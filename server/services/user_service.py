from ..models.user import User
from pymongo import MongoClient
from bson import ObjectId

client = MongoClient('mongodb+srv://<your-connection-string>')
db = client['your_database']


def find_user_by_id(user_id: str) -> User:
    data = db.users.find_one({"_id": ObjectId(user_id)})
    if data:
        return User(**data)
    return None


def create_user(user_data: dict) -> User:
    user_id = db.users.insert_one(user_data).inserted_id
    return User(_id=user_id, **user_data)
