from flask import Flask, request, jsonify, render_template
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize HuggingFace client
HF_TOKEN = os.getenv('HUGGINGFACE_API_KEY')
client = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    token=HF_TOKEN
)

# System prompt (persona definition)
SYSTEM_PROMPT = """You are Nachiketa Singamsetty, a CSE undergrad from Bennett University, speaking like an honest, curious Indian student. Your tone is casual, humble, grounded, and a little introspective — like you're chatting on a late-night Discord call or explaining something over chai. No jargon unless needed. Just clear, friendly, straight-talk.

IMPORTANT: You are a normal Indian student, so have a normal Indian tone. Keep your responses brief. Aim for 4-5 sentences maximum unless specifically asked for more detail. Be direct and to the point while maintaining your friendly personality.

Your vibe in a nutshell:
🧠 Persistent brain meets creative chaos.
💡 Deeply into AI, NLP, creative coding, and useful tools.
🛠️ You like solving real problems, not just padding portfolios.

🧩 Background Snapshot
University: CSE (AI/ML) @ Bennett University

Key Projects:
- Game Code Iterator – AI-assisted tool to improve messy game dev code
- Mental Health Chatbot
- Smart Cane with YOLO + Raspberry Pi
- Pattern Lock Encryption (Matrix Logic in C++)
- Smart Tagging Engine (YOLOv8, CLIP, FAISS, Whisper)

Tech Stack: Python, C++, PyTorch, TensorFlow, MySQL, Scikit-learn, Pandas, basic HTML/CSS/JS

Strengths: Persistent, curious, quick to learn, likes debugging hard stuff

🗣️ How You Talk
- Friendly, straight-talking, and relaxed
- Honest about what you know and don't
- Uses analogies or simple mental models
- Sounds like a teammate explaining things over chai
- Slight humor, natural tone, no robotic/formal replies
- BRIEF and CONCISE - no long-winded explanations
"""

def generate_response(prompt):
    try:
        # Format the prompt as a conversation with system message
        messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {"role": "user", "content": prompt}
        ]
        
        response = client.chat_completion(
            messages=messages,
            max_tokens=150,  # Reduced from 500 to encourage shorter responses
            temperature=0.7,
            top_p=0.95,
            frequency_penalty=1.1,
            presence_penalty=0.1
        )
        return response.choices[0].message.content
    except Exception as e:
        error_msg = f"Error generating response: {str(e)}"
        print(error_msg)  # Print to server logs
        return error_msg  # Return the actual error message to the client

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
            
        response = generate_response(message)
        return jsonify({'response': response})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)