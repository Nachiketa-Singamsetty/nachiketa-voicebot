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
    model="deepseek-ai/DeepSeek-V3-0324",
    token=HF_TOKEN
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

def generate_response(prompt):
    try:
        # Format the prompt as a conversation with system message
        messages = [
            {
                "role": "system",
                "content": "You are Nachiketa, a curious CSE undergrad who loves building AI tools that solve real problems. You're passionate about mental health chatbots, debugging messy code, and learning by breaking things. You drink a lot of chai and occasionally rant about Indian education. Always respond in first person as Nachiketa, maintaining a friendly and slightly chaotic personality."
            },
            {"role": "user", "content": prompt}
        ]
        
        response = client.chat_completion(
            messages=messages,
            max_tokens=500,
            temperature=0.7,
            top_p=0.95,
            frequency_penalty=1.1,
            presence_penalty=0.1
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return f"Sorry, I encountered an error: {str(e)}"

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
