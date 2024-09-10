from bson import ObjectId


class User:
    def __init__(self, _id: ObjectId, first_name: str, last_name: str, email: str, password: str, registered_date):
        self._id = _id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.registered_date = registered_date

    def to_dict(self):
        return {
            "_id": str(self._id),
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "registered_date": self.registered_date,
        }
