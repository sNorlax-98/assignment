from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId

app = Flask(__name__)
CORS(app)
uri = "mongodb+srv://snorlax-98:Anupam1234_@cluster0.sgrnwcn.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["todo-list"] 
todos_collection = db["todos"]


@app.route('/')
def index():
    return "Hello World"


@app.route('/todos', methods=['GET'])
def get_todos():
    todos = list(todos_collection.find())
    todos = [{'id': str(todo['_id']), 'title': todo['title'], 'completed': todo['completed']} for todo in todos]
    return jsonify(todos)


@app.route('/todos', methods=['POST'])
def create_todo():
    data = request.get_json()
    title = data.get('title')
    completed = False
    todo = {"title": title, "completed": completed}
    result = todos_collection.insert_one(todo)
    return jsonify(str(result.inserted_id))


@app.route('/todos/<string:id>', methods=['PUT'])
def update_todo(id):
    data = request.get_json()
    title = data.get('title')
    completed = data.get('completed')
    todos_collection.update_one({"_id": ObjectId(id)}, {"$set": {"title": title, "completed": completed}})
    return jsonify("Todo updated successfully")


@app.route('/todos/<string:id>', methods=['DELETE'])
def delete_todo(id):
    todos_collection.delete_one({"_id": ObjectId(id)})
    return jsonify("Todo deleted successfully")


if __name__ == '__main__':
    app.run(debug=True)
