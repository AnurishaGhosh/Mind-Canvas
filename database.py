from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["MindCanvas"]

journal_collection = db["journal_entries"]

mood_collection = db["moods"]


users_collection = db["users"]

activity_collection = db["activities"]

chat_collection = db["chat_history"]