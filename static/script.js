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
        if (micButton) micButton.disabled = true;
    }

    // Handle mic button click
    if (micButton) {
        micButton.addEventListener('click', () => {
            if (!isListening && recognition) {
                recognition.start();
            } else if (recognition) {
                recognition.stop();
            }
        });
    }

    // Handle export button click
    if (exportButton) {
        exportButton.addEventListener('click', exportToPDF);
    }

    // Add user message to chat
    function addUserMessage(text) {
        const template = document.getElementById('user-message-template');
        if (!template) return;
        
        const messageDiv = template.content.cloneNode(true);
        
        const messageText = messageDiv.querySelector('.message-text');
        const messageTime = messageDiv.querySelector('.message-time');
        
        if (messageText) messageText.textContent = text;
        if (messageTime) messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        if (chatMessages) {
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Add bot message with typing animation
    function addBotMessage() {
        const template = document.getElementById('bot-message-template');
        if (!template) return null;
        
        const messageDiv = template.content.cloneNode(true);
        
        const messageText = messageDiv.querySelector('.message-text');
        const messageTime = messageDiv.querySelector('.message-time');
        
        if (messageText) {
            messageText.classList.add('typing');
            messageText.textContent = 'Brewing response';
        }
        if (messageTime) {
            messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        
        if (chatMessages) {
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
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
            if (status) status.textContent = '🤖 Thinking...';
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
            if (status) status.textContent = 'Click the mic to start speaking';
        } catch (error) {
            console.error('API Error:', error);
            if (status) status.textContent = '❌ Error: ' + error.message;
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
        // Check if html2pdf is available
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf library not loaded');
            alert('PDF export feature is not available. Please ensure html2pdf library is loaded.');
            return;
        }

        const element = document.createElement('div');
        element.innerHTML = `
            <h1 style="text-align: center; color: #8B4513; font-family: 'JetBrains Mono', monospace; margin-bottom: 30px;">
                ☕ Chat with Nachiketa's Voice Assistant 💻
            </h1>
            <div style="margin-top: 20px;">
                ${chatMessages ? chatMessages.innerHTML : ''}
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

    // Carousel logic
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let carouselIndex = 0;

    function updateCarousel() {
        if (carouselItems.length > 0) {
            carouselItems.forEach((item, idx) => {
                item.classList.toggle('active', idx === carouselIndex);
            });
            if (carouselTrack) {
                carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
            }
        }
    }

    if (prevBtn && nextBtn && carouselItems.length > 0) {
        prevBtn.addEventListener('click', () => {
            carouselIndex = (carouselIndex - 1 + carouselItems.length) % carouselItems.length;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            carouselIndex = (carouselIndex + 1) % carouselItems.length;
            updateCarousel();
        });
    }
    
    updateCarousel();

    // Smooth scroll for nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Back to Top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Theme switcher
    const themeSwitcher = document.getElementById('themeSwitcher');
    
    function setTheme(dark) {
        document.body.classList.toggle('dark-mode', dark);
        if (typeof Storage !== 'undefined') {
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        }
    }
    
    // Load theme preference
    if (typeof Storage !== 'undefined' && localStorage.getItem('theme') === 'dark') {
        setTheme(true);
    }
    
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            setTheme(!document.body.classList.contains('dark-mode'));
        });
    }

    // Animate section headers/cards on scroll
    const animatedHeaders = document.querySelectorAll('.animated-header');
    const animatedCards = document.querySelectorAll('.project, .carousel-item');
    
    function animateOnScroll() {
        const trigger = window.innerHeight * 0.85;
        
        animatedHeaders.forEach(header => {
            const rect = header.getBoundingClientRect();
            if (rect.top < trigger) header.classList.add('visible');
        });
        
        animatedCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < trigger) card.classList.add('visible');
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Contact form enhancement
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data for potential future use
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            const existingSuccess = document.querySelector('.form-success');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            contactForm.insertAdjacentHTML('afterend', '<div class="form-success">Thank you! Your message has been sent. 🚀</div>');
            
            setTimeout(() => {
                const msg = document.querySelector('.form-success');
                if (msg) msg.remove();
            }, 4000);
        });
    }

    // Add floating animations
    const floatingElements = document.querySelectorAll('.floating-chai, .floating-code');
    floatingElements.forEach(element => {
        // Add random animation delay
        element.style.animationDelay = Math.random() * 2 + 's';
    });

    // Enhanced voice visualizer
    const voiceVisualizer = document.querySelector('.voice-visualizer');
    if (voiceVisualizer) {
        const bars = voiceVisualizer.querySelectorAll('.bar');
        
        function animateVoiceVisualizer() {
            if (isListening) {
                bars.forEach((bar, index) => {
                    const height = Math.random() * 20 + 5;
                    bar.style.height = height + 'px';
                    bar.style.animationDelay = (index * 0.1) + 's';
                });
            } else {
                bars.forEach(bar => {
                    bar.style.height = '5px';
                });
            }
        }
        
        setInterval(animateVoiceVisualizer, 200);
    }

    // Initialize any tooltips or interactive elements
    const interactiveElements = document.querySelectorAll('[title]');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.setAttribute('data-original-title', this.getAttribute('title'));
        });
    });

    console.log('🚀 Nachiketa\'s Portfolio - All systems initialized!');
});