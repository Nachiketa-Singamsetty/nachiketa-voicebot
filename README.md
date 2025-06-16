# Nachiketa's Voice Assistant 🤖

A voice-enabled web application that allows you to have natural conversations with an AI assistant. Built with Flask, HuggingFace's DeepSeek model, and modern web technologies.

## Features ✨

- 🎤 Real-time voice input using Web Speech API
- 🔊 Text-to-speech responses
- 💬 Beautiful chat interface with typing animations
- ☕ Chai + Code inspired theme
- 📱 Responsive design
- 📄 Export chat history to PDF
- 🤖 Powered by HuggingFace's DeepSeek model

## Tech Stack 🛠️

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **AI Model**: HuggingFace DeepSeek
- **Voice**: Web Speech API
- **Styling**: Custom CSS with modern animations

## Setup Instructions 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nachiketa-voicebot.git
cd nachiketa-voicebot
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your HuggingFace API token:
```bash
HUGGINGFACE_API_KEY=your_api_key_here
```

5. Configure the AI model:
   - The application uses the DeepSeek model from HuggingFace
   - The model configuration is in `app.py`
   - You can modify the model parameters in the `generate_response` function:
     - `max_length`: Maximum length of generated response
     - `temperature`: Controls randomness (higher = more random)
     - `top_p`: Controls diversity via nucleus sampling
     - `repetition_penalty`: Prevents repetitive text

6. Run the application:
```bash
python app.py
```

7. Open your browser and navigate to:
```
http://localhost:5000
```

## Usage 🎯

1. Click the microphone button to start speaking
2. Wait for the assistant to process your input
3. Listen to the voice response
4. Export your chat history using the export button

## Browser Compatibility 🌐

- Chrome (recommended)
- Edge
- Firefox
- Safari

Note: Speech recognition works best in Chrome-based browsers.

## Troubleshooting 🔧

1. **Speech Recognition Not Working**
   - Ensure you're using a supported browser (Chrome recommended)
   - Check if your microphone is properly connected and permitted
   - Try refreshing the page

2. **API Errors**
   - Verify your HuggingFace API key is correct in the `.env` file
   - Check your internet connection
   - Ensure you have sufficient API credits

3. **Model Response Issues**
   - Adjust the model parameters in `app.py` if responses are too short/long
   - Check the console for any error messages
   - Verify the model is properly loaded

## Contributing 🤝

Feel free to open issues and pull requests!

## License 📝

MIT License - feel free to use this project for your own purposes!

## Author 👨‍💻

Created by Nachiketa - A curious CSE undergrad who loves building AI tools that solve real problems.

---
Made with ☕ and 💻 