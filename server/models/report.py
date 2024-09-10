from bson import ObjectId


class Report:
    def __init__(self, _id: ObjectId, user_id: ObjectId, name: str, description: str, data, created_at):
        self._id = _id
        self.user_id = user_id
        self.name = name
        self.description = description
        self.data = data
        self.created_at = created_at

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "name": self.name,
            "description": self.description,
            "data": self.data,
            "created_at": self.created_at,
        }
