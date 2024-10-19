from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/get_game', methods=['GET'])
def get_latest_game_result():
    username = request.args.get('username')

    if not username:
        return jsonify({"error": "Username not provided"}), 400

    url = f"https://lichess.org/api/games/user/{username}?max=1"
    response = requests.get(url, headers={"Accept": "application/x-ndjson"})

    if response.status_code == 200:
        game_data = response.text.splitlines()
        if game_data:
            latest_game = game_data[0]
            game_json = json.loads(latest_game)

            winner = game_json.get("winner")
            players = game_json.get("players", {})
            white_username = players.get("white", {}).get("user", {}).get("name", "unknown")
            black_username = players.get("black", {}).get("user", {}).get("name", "unknown")

            if winner:
                result = {
                    "Winner": winner,
                    "White": white_username,
                    "Black": black_username,
                }
            else:
                result = {
                    "Result": "Draw",
                    "White": white_username,
                    "Black": black_username
                }
            return jsonify(result)
        else:
            return jsonify({"error": "No games found"}), 404
    else:
        return jsonify({"error": f"Failed to fetch games, status code: {response.status_code}"}), response.status_code

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
