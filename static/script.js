document.addEventListener('DOMContentLoaded', () => {
    const micButton = document.getElementById('micButton');
    const status = document.getElementById('status');
    const chatMessages = document.getElementById('chat-messages');
    const exportButton = document.getElementById('exportButton');
    
    let recognition = null;
    let isListening = false;
    let currentBotMessage = null;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            micButton.classList.add('listening');
            status.textContent = '🎤 Listening for your voice...';
        };

        recognition.onend = () => {
            isListening = false;
            micButton.classList.remove('listening');
            status.textContent = 'Click the mic to start speaking';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            addUserMessage(transcript);
            sendToAPI(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            status.textContent = '❌ Error: ' + event.error;
            isListening = false;
            micButton.classList.remove('listening');
        };
    } else {
        status.textContent = '❌ Speech recognition not supported in this browser';
        micButton.disabled = true;
    }

    // Handle mic button click
    micButton.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });

    // Handle export button click
    exportButton.addEventListener('click', exportToPDF);

    // Add user message to chat
    function addUserMessage(text) {
        const template = document.getElementById('user-message-template');
        const messageDiv = template.content.cloneNode(true);
        
        const messageText = messageDiv.querySelector('.message-text');
        const messageTime = messageDiv.querySelector('.message-time');
        
        messageText.textContent = text;
        messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add bot message with typing animation
    function addBotMessage() {
        const template = document.getElementById('bot-message-template');
        const messageDiv = template.content.cloneNode(true);
        
        const messageText = messageDiv.querySelector('.message-text');
        const messageTime = messageDiv.querySelector('.message-time');
        
        messageText.classList.add('typing');
        messageText.textContent = 'Brewing response';
        messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageText;
    }

    // Update bot message with response
    function updateBotMessage(text) {
        if (currentBotMessage) {
            currentBotMessage.classList.remove('typing');
            currentBotMessage.textContent = text;
        }
    }

    // Send message to API
    async function sendToAPI(message) {
        try {
            status.textContent = '🤖 Thinking...';
            currentBotMessage = addBotMessage();

            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            updateBotMessage(data.response);
            speakResponse(data.response);
            status.textContent = 'Click the mic to start speaking';
        } catch (error) {
            console.error('API Error:', error);
            status.textContent = '❌ Error: ' + error.message;
            updateBotMessage(`❌ Error: ${error.message}`);
        }
    }

    // Text to speech
    function speakResponse(text) {
        if ('speechSynthesis' in window) {
            // Clean markdown formatting from text
            const cleanText = text
                .replace(/\*/g, '') // Remove asterisks
                .replace(/_/g, '')  // Remove underscores
                .replace(/`/g, '')  // Remove backticks
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to just text
                .replace(/\n/g, ' '); // Replace newlines with spaces

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    // Export chat to PDF
    function exportToPDF() {
        const element = document.createElement('div');
        element.innerHTML = `
            <h1 style="text-align: center; color: #8B4513; font-family: 'JetBrains Mono', monospace; margin-bottom: 30px;">
                ☕ Chat with Nachiketa's Voice Assistant 💻
            </h1>
            <div style="margin-top: 20px;">
                ${chatMessages.innerHTML}
            </div>
        `;

        const opt = {
            margin: 1,
            filename: 'nachiketa-voice-chat.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    }

    // Add demo message on load
    setTimeout(() => {
        currentBotMessage = addBotMessage();
        setTimeout(() => {
            if (currentBotMessage) {
                currentBotMessage.classList.remove('typing');
                currentBotMessage.textContent = "👋 Hello! I'm Nachiketa's voice assistant. Click the microphone and start speaking - I'll respond in my own voice!";
            }
        }, 1000);
    }, 500);
});