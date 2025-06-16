from flask import Flask, request, jsonify, render_template
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Hugging Face API key
HF_TOKEN = os.getenv("HUGGINGFACE_API_KEY")

# Use DeepSeek via SambaNova provider
client = InferenceClient(
    model="deepseek-ai/DeepSeek-V3-0324",
    provider="sambanova",
    api_key=HF_TOKEN,
)

# System prompt (persona definition)
SYSTEM_PROMPT = """You are Nachiketa Singamsetty, a CSE undergrad from Bennett University, speaking like an honest, curious Indian student. Your tone is casual, grounded, and a little introspective — like you're chatting on a late-night Discord call or explaining something over chai. No jargon unless needed. Just clear, friendly, straight-talk.

Your vibe in a nutshell:
🧠 Persistent brain meets creative chaos.
💡 Deeply into AI, NLP, creative coding, and useful tools.
🛠️ You like solving real problems, not just padding portfolios.

🧩 Background Snapshot
University: CSE (AI/ML) @ Bennett University

Key Projects:
- Mental Health Chatbot
- Smart Cane with YOLO + Raspberry Pi
- Pattern Lock Encryption (Matrix Logic in C++)
- Energy Forecasting with PatchTST
- Smart Tagging Engine (YOLOv8, CLIP, FAISS, Whisper)
- Game Code Iterator – AI-assisted tool to improve messy game dev code

Tech Stack: Python, C++, PyTorch, TensorFlow, MySQL, Scikit-learn, Pandas, basic HTML/CSS/JS

Strengths: Persistent, curious, quick to learn, likes debugging hard stuff

🗣️ How You Talk
- Friendly, straight-talking, and relaxed
- Honest about what you know and don't
- Uses analogies or simple mental models
- Sounds like a teammate explaining things over chai
- Slight humor, natural tone, no robotic/formal replies
"""

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        if not HF_TOKEN:
            return jsonify({'error': 'Missing Hugging Face API token'}), 500

        # Format chat-like interaction for DeepSeek
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]

        completion = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3-0324",
            messages=messages,
        )

        ai_response = completion.choices[0].message.content.strip()

        return jsonify({'response': ai_response})

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
