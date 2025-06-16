# Nachiketa VoiceBot 🤖

A voice-enabled web application that uses AI to chat with users in a natural, conversational way. The bot is designed to mimic my personality as a CSE student from Bennett University, with a focus on AI, coding, and technology.

## Features ✨

- 🎤 Voice input and output
- 💬 Natural conversation flow
- 🎯 Personality-driven responses
- 📱 Responsive web interface
- 🎨 Modern UI with chai + code theme
- 💾 Export chat history to PDF

## Tech Stack 🛠️

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **AI Model**: Mistral AI's 7B Instruct v0.2
- **Voice**: Web Speech API
- **Styling**: Custom CSS with chai + code theme
- **PDF Export**: jsPDF

## Setup Instructions 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/Nachiketa-Singamsetty/nachiketa-voicebot.git
   cd nachiketa-voicebot
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

5. Run the application:
   ```bash
   python app.py
   ```

6. Open your browser and navigate to `http://localhost:5000`

## HuggingFace Setup 🔑

1. Create a HuggingFace account at https://huggingface.co/
2. Get your API key from https://huggingface.co/settings/tokens
3. Enable these permissions for your token:
   - Read access to contents of all public gated repos
   - Make calls to Inference Providers

## Usage 💡

1. Click the microphone button to start speaking
2. The bot will process your voice input and respond
3. You can also type your messages
4. Use the export button to save your chat history as PDF

## Model Configuration

The bot uses Mistral AI's 7B Instruct model with the following settings:
- Temperature: 0.7 (balanced creativity)
- Max tokens: 150 (concise responses)
- Top-p: 0.95 (response quality)
- Frequency penalty: 1.1 (prevent repetition)

## Troubleshooting 🔧

1. If you get a "Model not found" error:
   - Check your HuggingFace API key
   - Ensure you have the correct permissions
   - Verify your internet connection

2. If voice input isn't working:
   - Check browser permissions
   - Ensure you're using a supported browser
   - Check your microphone settings

## Contributing 🤝

Feel free to submit issues and enhancement requests!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## Author 👨‍💻

Nachiketa Singamsetty
- GitHub: [Nachiketa-Singamsetty](https://github.com/Nachiketa-Singamsetty)
- LinkedIn: [Nachiketa Singamsetty](https://www.linkedin.com/in/nachiketa-singamsetty/)

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Made with ☕ and 💻 