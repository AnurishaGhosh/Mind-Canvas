from ai import client


from flask import Flask, render_template, request, jsonify
from database import journal_collection
from database import mood_collection
from database import users_collection
from database import activity_collection
from database import chat_collection
from datetime import datetime,time
from bson.objectid import ObjectId

app = Flask(__name__)


current_mood = ""


# ---------------- PAGES ----------------

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/journal")
def journal():
    return render_template("journal.html")


@app.route("/entries")
def entries():
    return render_template("Entries.html")


@app.route("/moodtracker")
def moodtracker():
    return render_template("Mood tracker.html")


@app.route("/insights")
def insights():
    return render_template("Insights.html")


@app.route("/resources")
def resources():
    return render_template("Resources.html")


@app.route("/activity")
def activity():

    email = request.args.get("email")

    if email:
        reset_daily_activities(email)

    return render_template("Activity.html")


@app.route("/settings")
def settings():
    return render_template("Settings.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")




# ---------------- SAVE JOURNAL ----------------

@app.route("/save", methods=["POST"])
def save_entry():

    print("Save API called")


    data = request.get_json()

    print(data)


    title = data.get("title")
    content = data.get("content")
    email = data.get("email")
    
    
    #gemini connection  
    
    prompt = f"""
    You are an AI Mental Wellness Assistant.

    Analyze the journal entry below.

    Return ONLY a valid JSON object.
    Do not include markdown.
    Do not include ```json.
    Do not include explanations.

    Return exactly this structure:

    {{
    "summary": "",
    "mood"(select 😊 Happy or 😐 Neutral 😔 Sad 😡 Angry 😴 Tired): "",
    "mood_score": "",
    "emotion": "",
    "sentiment": "",
    "suggestions": [
      "",
      "",
      ""
    ],
    "motivation": "",
    "reflection_question": ""
    }}

    Journal Entry:
    {content}
    """
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )
    ai_response = response.text

    print(ai_response)

    if not title or not content:

        return jsonify({
            "message":"Fill both fields"
        }),400



    result = journal_collection.insert_one({
        
        "email": email,
        "title":title,

        "content":content,

        "created_at": datetime.now(),
        "updated_at": datetime.now()

    })


    print("Inserted ID:", result.inserted_id)



    return jsonify({

        "message":"Journal Saved Successfully"

    })




# ---------------- GET JOURNAL ENTRIES ----------------

@app.route("/entriesdata", methods=["POST"])
def entries_data():

    data = request.get_json()
    email = data.get("email")

    entries = []

    for entry in journal_collection.find(
        {"email": email}
    ).sort("created_at", -1):

        entries.append({
            "_id": str(entry["_id"]),
            "email": entry["email"],
            "title": entry["title"],
            "content": entry["content"],
            "created_at": entry["created_at"].isoformat()
        })

    return jsonify(entries)




# ---------------- DELETE SINGLE ENTRY ----------------

@app.route("/delete-entry/<id>", methods=["DELETE"])
def delete_entry(id):


    try:
        data = request.get_json()
        email = data.get("email")
        result = journal_collection.delete_one({

            "_id":ObjectId(id),
            "email": email

        })


        if result.deleted_count == 1:


            return jsonify({

                "message":"Entry deleted successfully"

            })


        return jsonify({

            "message":"Entry not found"

        }),404
    except Exception as e:


        return jsonify({

            "message":str(e)

        }),500





# ---------------- DELETE ALL ENTRIES ----------------

@app.route("/delete", methods=["DELETE"])
def delete_entries():

    data = request.get_json()
    email = data.get("email")

    journal_collection.delete_many({
        "email": email
    })

    return jsonify({
        "message": "All Entries Deleted"
    })



# ---------------- MOOD ----------------

@app.route("/save_mood", methods=["POST"])
def save_mood():

    data = request.get_json()
    print("Received:", data)

    email = data.get("email")
    mood = data.get("mood")

    # End the previous mood if it is still active
    previous_mood = mood_collection.find_one(
        {
            "email": email,
            "ended_at": None
        },
        sort=[("started_at", -1)]
    )

    if previous_mood:

        end_time = datetime.now()

        duration = int(
            (end_time - previous_mood["started_at"]).total_seconds()
        )

        mood_collection.update_one(
            {"_id": previous_mood["_id"]},
            {
                "$set": {
                    "ended_at": end_time,
                    "duration_seconds": duration,
                    "status": "Completed"
                }
            }
        )

    # Insert the new mood
    mood_collection.insert_one({
        "email": email,
        "mood": mood,
        "started_at": datetime.now(),
        "ended_at": None,
        "duration_seconds": None,
        "status": "Active"
    })

    return jsonify({
        "success": True
    })


@app.route("/remove_mood", methods=["POST"])
def remove_mood():

    data = request.get_json()

    email = data.get("email")

    mood = mood_collection.find_one(
        {
            "email": email,
            "ended_at": None
        },
        sort=[("started_at", -1)]
    )

    if mood:

        end_time = datetime.now()

        duration = int(
            (end_time - mood["started_at"]).total_seconds()
        )

        mood_collection.update_one(
            {"_id": mood["_id"]},
            {
                "$set": {
                    "ended_at": end_time,
                    "duration_seconds": duration,
                    "status": "Completed"

                }
            }
        )

    return jsonify({
        "success": True
    })


@app.route("/get_mood", methods=["POST"])
def get_mood():

    data = request.get_json()

    email = data.get("email")

    mood = mood_collection.find_one(
        {
            "email": email,
            "ended_at": None
        },
        sort=[("started_at", -1)]
    )

    if mood:
        return jsonify({
            "exists": True,
            "mood": mood["mood"]
        })

    return jsonify({
        "exists": False
    })
    
# ----------------user information ------------------


@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    gender = data.get("gender")
    
    if not name or not email or not password or not gender:
        return jsonify({
            "success": False,
            "message": "Please fill in all fields to create an account."
        })

    # Check if email already exists
    if users_collection.find_one({"email": email}):
        return jsonify({
            "success": False,
            "message": "Email already exists"
        })

    else: users_collection.insert_one({
        "name": name,
        "email": email,
        "password": password,
        "gender": gender
    })

    return jsonify({
        "success": True,
        "message": "Account Created Successfully"
    })
    
    
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({
        "email": email,
        "password": password
    })

    if user:
        return jsonify({
            "success": True,
            "name": user["name"],
            "gender": user["gender"],
            "email": user["email"] 
        })

    return jsonify({
        "success": False,
        "message": "Wrong Email or Password"
    })
    
# ----------------- Activity -------------------

@app.route("/save_activity", methods=["POST"])
def save_activity():

    data = request.get_json()

    email = data.get("email")
    activity = data.get("activity")

    today = datetime.now().strftime("%Y-%m-%d")

    update_data = {}

    # Water
    if activity == "water":

        update_data["activities.water"] = {
            "glasses": data.get("glasses", 0)
        }

    # Food
    elif activity == "food":

        meal = data.get("meal").lower()

        update_data[f"activities.food.{meal}"] = {

            "start": data.get("start"),
            "end": data.get("end"),
            "duration": data.get("duration"),
            "completed": True
        }

    # Sleep
    elif activity == "sleep":

        update_data["activities.sleep"] = {

            "start": data.get("start"),
            "end": data.get("end"),
            "duration": data.get("duration")
        }

    # Me Time
    elif activity == "me_time":

        update_data["activities.me_time"] = {

            "start": data.get("start"),
            "end": data.get("end"),
            "duration": data.get("duration")
        }

    # Walk
    elif activity == "walk":

        update_data["activities.walk"] = {

            "start": data.get("start"),
            "end": data.get("end"),
            "duration": data.get("duration")
        }

    # Workout
    elif activity == "workout":

        update_data["activities.workout"] = {

            "start": data.get("start"),
            "end": data.get("end"),
            "duration": data.get("duration")
        }

    # Meditation
    elif activity == "meditation":

        update_data["activities.meditation"] = {

            "start": data.get("start"),
            "end": data.get("end"),
            "duration": data.get("duration")
        }

    # Journal
    elif activity == "journal":

        update_data["activities.journal"] = {

            "completed": True,
            "time": datetime.now()
        }

    activity_collection.update_one(

        {
            "email": email,
            "date": today
        },

        {
            "$set": update_data,
            "$setOnInsert": {
                "last_reset_date": today
            }
        },

        upsert=True
    )

    return jsonify({
        "success": True
    })


# ----------------- DAILY RESET -------------------

def reset_daily_activities(email):

    now = datetime.now()
    today = now.strftime("%Y-%m-%d")

    user = activity_collection.find_one({
        "email": email
    })

    # First time user
    if not user:

        activity_collection.insert_one({

            "email": email,
            "date": today,
            "last_reset_date": today,

            "activities": {

                "meditation": {},
                "journal": {},
                "walk": {},
                "workout": {},
                "water": {
                    "glasses": 0
                },
                "sleep": {},
                "food": {},
                "me_time": {}

            }

        })

        return

    # Reset once every day after 7:00 AM
    if now.time() >= time(7, 0):

        if user.get("last_reset_date") != today:

            activity_collection.update_one(

                {
                    "email": email
                },

                {
                    "$set": {

                        "date": today,
                        "last_reset_date": today,

                        "activities": {

                            "meditation": {},
                            "journal": {},
                            "walk": {},
                            "workout": {},
                            "water": {
                                "glasses": 0
                            },
                            "sleep": {},
                            "food": {},
                            "me_time": {}

                        }

                    }
                }

            )
            
#---------------chatbot--------------            
            
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message")
        email = data.get("email")
    
        prompt = f"""
        You are Eva, the AI assistant of MindCanvas.
        You are warm, empathetic, patient, and supportive.
        Treat every user like a trusted friend while remaining professional.
        you have to be a friend of such mentaily stressed and tired people along about Mental wellness
        Be empathetic and supportive.
        Do not diagnose medical conditions.
        User: {user_message}
        """

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )
        
        reply = response.text
        now = datetime.now()
        chat_collection.insert_one({
            "email": email,
            "user_message": user_message,       
            "ai_response": reply,
            "timestamp": now,
            "day": now.strftime("%A"),
            "date_string": now.strftime("%Y-%m-%d")
        
        })

        return jsonify({
            "reply": reply
        })
    
    
    except Exception as e:
        print("Gemini Error:", e)

        return jsonify({
            "reply": "⚠️ I am currently busy. Please talk to me again after a few minutes."
        })
    
    
@app.route("/get_chat_history", methods=["POST"])
def get_chat_history():
    data = request.get_json()
    email = data.get("email")

    chats = chat_collection.find(
        {"email": email},
        {"_id": 0}
    ).sort("timestamp", 1)

    history = []

    for chat in chats:
        history.append({
            "user": chat["user_message"],
            "bot": chat["ai_response"]
        })

    return jsonify(history)

@app.route("/clear_chat", methods=["POST"])
def clear_chat():

    data = request.get_json()
    email = data.get("email")

    print("Email received:", email)

    result = chat_collection.delete_many({"email": email})

    print("Deleted documents:", result.deleted_count)

    return jsonify({"success": True})



if __name__ == "__main__":
    app.run(debug=True)
    
    
    

    
    