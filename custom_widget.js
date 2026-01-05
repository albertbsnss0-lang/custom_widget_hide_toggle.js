(function () {
  const styles = `
    .n8n-chat-widget {
      --chat--color-primary: var(--n8n-chat-primary-color, #0B1F3B);
      --chat--color-secondary: var(--n8n-chat-secondary-color, #0B1F3B);
      --chat--color-background: var(--n8n-chat-background-color, #FFFFFF);
      --chat--color-font: var(--n8n-chat-font-color, #0B1F3B);
      font-family: 'Poppins', sans-serif;
    }

    @keyframes launcherPulse {
      0% { box-shadow: 0 10px 30px rgba(11, 31, 59, 0.35); }
      50% { box-shadow: 0 12px 36px rgba(11, 31, 59, 0.45); transform: translateY(-1px); }
      100% { box-shadow: 0 10px 30px rgba(11, 31, 59, 0.35); }
    }

    .n8n-chat-widget .chat-container.open + .chat-toggle {
      display: none !important;
    }

    .n8n-chat-widget .chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: none;
      width: 400px;
      max-width: 420px;
      height: 600px;
      max-height: 80vh;
      background: var(--chat--color-background);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(11, 31, 59, 0.15);
      border: 1px solid rgba(11, 31, 59, 0.2);
      overflow: hidden;
      font-family: inherit;
    }
    .n8n-chat-widget .chat-container.position-left {
      right: auto;
      left: 20px;
    }
    .n8n-chat-widget .chat-container.open {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 600px) {
      .n8n-chat-widget .chat-container {
        width: 100%;
        height: 80vh;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0;
      }
    }

    .n8n-chat-widget .brand-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--chat--color-primary);
      color: #FFFFFF;
      position: relative;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .n8n-chat-widget .brand-header img {
      width: 32px;
      height: 32px;
    }
    .n8n-chat-widget .title-block {
      display: flex;
      flex-direction: column;
    }
    .n8n-chat-widget .brand-title {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
    }
    .n8n-chat-widget .brand-subtitle {
      font-size: 12px;
      font-weight: 500;
      color: #C7D4E3;
    }
    .n8n-chat-widget .close-button {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #FFFFFF;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      opacity: 0.6;
    }
    .n8n-chat-widget .close-button:hover {
      opacity: 1;
    }

    .n8n-chat-widget .new-conversation {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      text-align: center;
      width: 100%;
      max-width: 300px;
    }
    .n8n-chat-widget .welcome-text {
      font-size: 24px;
      font-weight: 600;
      color: var(--chat--color-font);
      margin-bottom: 24px;
    }
    .n8n-chat-widget .new-chat-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 16px 24px;
      background: var(--chat--color-primary);
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 12px;
    }
    .n8n-chat-widget .message-icon {
      width: 20px;
      height: 20px;
    }

    .n8n-chat-widget .chat-interface {
      display: none;
      flex-direction: column;
      height: 100%;
    }
    .n8n-chat-widget .chat-interface.active {
      display: flex;
    }

    .n8n-chat-widget .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: var(--chat--color-background);
      display: flex;
      flex-direction: column;
    }
    .n8n-chat-widget .chat-message {
      padding: 12px 16px;
      margin: 8px 0;
      border-radius: 12px;
      max-width: 80%;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
    }
    .n8n-chat-widget .chat-message.user {
      background: var(--chat--color-primary);
      color: #FFFFFF;
      align-self: flex-end;
    }
    .n8n-chat-widget .chat-message.bot {
      background: #F3F5F7;
      border: 1px solid #D9DEE5;
      color: var(--chat--color-font);
      align-self: flex-start;
    }

    .n8n-chat-widget .chat-input {
      padding: 16px;
      border-top: 1px solid rgba(11, 31, 59, 0.1);
      display: flex;
      gap: 8px;
    }
    .n8n-chat-widget .chat-input textarea {
      flex: 1;
      padding: 12px;
      border: 1px solid #D9DEE5;
      border-radius: 8px;
      background: var(--chat--color-background);
      color: var(--chat--color-font);
      resize: none;
      font-size: 14px;
    }
    .n8n-chat-widget .chat-input button {
      background: var(--chat--color-primary);
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      padding: 0 20px;
      cursor: pointer;
      font-size: 14px;
    }

    .n8n-chat-widget .chat-toggle {
      position: fixed;
      bottom: 20px !important;
      right: 20px !important;
      top: auto !important;
      left: auto !important;
      height: 60px;
      padding: 0 24px;
      border-radius: 999px;
      background: var(--chat--color-primary);
      color: #FFFFFF;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(11, 31, 59, 0.35);
      z-index: 1000;
      animation: launcherPulse 12s infinite;
    }
    @media (max-width: 600px) {
      .n8n-chat-widget .chat-toggle {
        bottom: 20px;
        right: 20px;
        height: 56px;
        padding: 0 20px;
      }
    }
    .n8n-chat-widget .launcher-icon {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }
    .n8n-chat-widget .launcher-text {
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
    }
    .n8n-chat-widget .launcher-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #16a34a;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 999px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      pointer-events: none;
    }
  `;

  // Load Poppins font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';
  document.head.appendChild(fontLink);

  // Append CSS rules to document
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Default config
  const defaultConfig = {
    webhook: { url: '', route: '' },
    branding: { logo: '', name: '', title: '', subtitle: '', welcomeText: '', responseTimeText: '' },
    style: { primaryColor: '#0B1F3B', secondaryColor: '#0B1F3B', position: 'right', backgroundColor: '#FFFFFF', fontColor: '#0B1F3B' }
  };

  const config = window.ChatWidgetConfig ? {
    webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
    branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
    style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
  } : defaultConfig;

  // Prevent duplicate initialization
  if (window.CustomIcleanWidgetLoaded) return;
  window.CustomIcleanWidgetLoaded = true;

  // State (persists until refresh)
  let currentSessionId = '';
  let welcomeTimer = null;
  let hasOpenedOnce = false; // welcome/loader only on first open
  let chatStarted = false;   // once true, never show welcome/loader again
  // Flag to ensure the initial greeting is sent only once per page load
  let initialGreetingSent = false;

  const widgetContainer = document.createElement('div');
  widgetContainer.className = 'n8n-chat-widget';
  widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
  widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
  widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
  widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

  const chatContainer = document.createElement('div');
  chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

  const newConversationHTML = `
    <div class="brand-header brand-header-welcome">
      <img src="${config.branding.logo}" alt="${config.branding.name}">
      <div class="title-block">
        <span class="brand-title">${config.branding.title || config.branding.name}</span>
        <span class="brand-subtitle">${config.branding.subtitle}</span>
      </div>
      <button class="close-button">×</button>
    </div>
    <div class="new-conversation">
      <h2 class="welcome-text">${config.branding.welcomeText}</h2>
      <button class="new-chat-btn">
        <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z" />
        </svg>
        Send us a message
      </button>
      <p class="response-text">${config.branding.responseTimeText}</p>
    </div>
  `;

  const chatInterfaceHTML = `
    <div class="chat-interface">
      <div class="brand-header brand-header-chat">
        <img src="${config.branding.logo}" alt="${config.branding.name}">
        <div class="title-block">
          <span class="brand-title">${config.branding.title || config.branding.name}</span>
          <span class="brand-subtitle">${config.branding.subtitle}</span>
        </div>
        <button class="close-button">×</button>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input">
        <textarea placeholder="Type your message here..." rows="1"></textarea>
        <button type="submit">Send</button>
      </div>
      <div class="chat-footer"></div>
    </div>
  `;

  chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;

  const toggleButton = document.createElement('button');
  toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
  toggleButton.innerHTML = `
    <span class="launcher-badge">Online</span>
    <svg class="launcher-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
    <span class="launcher-text">Get a Free Quote</span>
  `;

  widgetContainer.appendChild(chatContainer);
  widgetContainer.appendChild(toggleButton);
  document.body.appendChild(widgetContainer);

  // Elements
  const newChatBtn = chatContainer.querySelector('.new-chat-btn');
  const newConversationScreen = chatContainer.querySelector('.new-conversation');
  const welcomeHeader = chatContainer.querySelector('.brand-header-welcome');

  const chatInterface = chatContainer.querySelector('.chat-interface');
  const messagesContainer = chatContainer.querySelector('.chat-messages');
  const textarea = chatContainer.querySelector('textarea');
  const sendButton = chatContainer.querySelector('button[type="submit"]');

  // Loader element
  const welcomeLoader = document.createElement('div');
  welcomeLoader.style.textAlign = 'center';
  welcomeLoader.style.padding = '40px 20px';
  welcomeLoader.style.color = '#040559';
  welcomeLoader.style.fontSize = '16px';
  welcomeLoader.style.fontWeight = '500';
  welcomeLoader.textContent = 'Preparing your assistant...';

  // Insert loader above welcome screen
  if (newConversationScreen) {
    chatContainer.insertBefore(welcomeLoader, newConversationScreen);
  } else {
    chatContainer.appendChild(welcomeLoader);
  }

  // Hide loader and welcome by default (they will show only on first open)
  welcomeLoader.style.display = 'none';
  if (newConversationScreen) newConversationScreen.style.display = 'none';
  if (welcomeHeader) welcomeHeader.style.display = 'none';

  function generateUUID() {
    return crypto.randomUUID();
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function renderInitialBotMessage() {
  // Prevent duplicate greeting
  if (messagesContainer.children.length > 0) return;

  const botMsg = document.createElement('div');
  botMsg.className = 'chat-message bot';
  botMsg.textContent =
    "Hi there! I’m the virtual assistant of iCLEAN AZ. How can I help you today?";

  messagesContainer.appendChild(botMsg);
  scrollToBottom();
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-message bot typing';
    typing.textContent = 'Typing…';
    messagesContainer.appendChild(typing);
    scrollToBottom();
    return typing;
  }

  // Keep scrolled
  const observer = new MutationObserver(() => scrollToBottom());
  observer.observe(messagesContainer, { childList: true });

  function activateChatUI() {
    // Ensure chat UI is visible
    chatInterface.classList.add('active');
  }

  function removeWelcomeForever() {
    // Stop timer
    if (welcomeTimer) {
      clearTimeout(welcomeTimer);
      welcomeTimer = null;
    }
    // Remove welcome elements
    if (newConversationScreen && newConversationScreen.parentElement) newConversationScreen.remove();
    if (welcomeLoader && welcomeLoader.parentElement) welcomeLoader.remove();
    if (welcomeHeader && welcomeHeader.parentElement) welcomeHeader.remove();
  }

  async function startNewConversationIfNeeded() {
    // Do not create a new session if we already have one (preserve until refresh)
    if (currentSessionId) {
      activateChatUI();
      return;
    }

    currentSessionId = generateUUID();
    activateChatUI();

    const payload = [
      {
        action: 'loadPreviousSession',
        sessionId: currentSessionId,
        route: config.webhook.route,
        metadata: { userId: '' }
      }
    ];

    try {
      const response = await fetch(config.webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      await response.json(); // consume response, do nothing with UI

    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  }

  async function sendMessage(message) {
    // Ensure session exists first
    if (!currentSessionId) {
      await startNewConversationIfNeeded();
    }

    const payload = {
      action: 'sendMessage',
      sessionId: currentSessionId,
      route: config.webhook.route,
      chatInput: message,
      metadata: { userId: '' }
    };

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = message;
    messagesContainer.appendChild(userMsg);
    scrollToBottom();

    const typingIndicator = showTyping();

    try {
      const response = await fetch(config.webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (typingIndicator.parentElement) {
        messagesContainer.removeChild(typingIndicator);
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      botMsg.textContent = Array.isArray(data) ? data[0].output : data.output;
      messagesContainer.appendChild(botMsg);
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      if (typingIndicator.parentElement) {
        messagesContainer.removeChild(typingIndicator);
      }
    }
  }

  /**
   * Send an initial message automatically once the chat is opened.
   *
   * This helper sends a request to the webhook using the same
   * "sendMessage" action as regular messages but does not
   * render a user bubble in the conversation. It displays only the
   * bot's response, so the greeting appears without the user having
   * to type anything.
   */
  async function sendInitialMessage() {
    // Ensure a session exists
    if (!currentSessionId) {
      await startNewConversationIfNeeded();
    }

    // Use a dummy initial input (e.g. "Hi") to trigger the backend's greeting logic.
    // Avoid rendering this in the UI by not creating a user bubble.
    const payload = {
      action: 'sendMessage',
      sessionId: currentSessionId,
      route: config.webhook.route,
      chatInput: 'Hi',
      metadata: { userId: '' }
    };

    const typingIndicator = null;

    try {
      const response = await fetch(config.webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      

      // Append bot's greeting
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      botMsg.textContent = Array.isArray(data) ? data[0].output : data.output;
      messagesContainer.appendChild(botMsg);
      scrollToBottom();
    } catch (err) {
      console.error('Error sending initial message:', err);
      if (typingIndicator.parentElement) {
        messagesContainer.removeChild(typingIndicator);
      }
    }
  }

  // Welcome button → start chat, remove welcome forever, show chat UI, start session (once)
  newChatBtn.addEventListener('click', async () => {
    chatStarted = true;
    removeWelcomeForever();
    activateChatUI();
    renderInitialBotMessage();

    if (!chatContainer.classList.contains('open')) {
      chatContainer.classList.add('open');
    }

    await startNewConversationIfNeeded();
    // Automatically send the initial greeting if no messages have been added yet
    if (messagesContainer.children.length === 0) {
      await sendInitialMessage();
    }
  });

  // Send button
  sendButton.addEventListener('click', async () => {
    const message = textarea.value.trim();
    if (!message) return;

    if (!chatStarted) {
      chatStarted = true;
      removeWelcomeForever();
      activateChatUI();
    }

    // Define a helper to clear the textarea and dispatch an input event
    const clearInput = () => {
      textarea.value = '';
      textarea.dispatchEvent(new Event('input'));
    };
    // Clear the textarea immediately on send
    clearInput();
    // Send the message
    await sendMessage(message);
    // Clear again after send in case the framework reverts it
    clearInput();
  });

  // Enter to send
  textarea.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const message = textarea.value.trim();
      if (!message) return;

      if (!chatStarted) {
        chatStarted = true;
        removeWelcomeForever();
        activateChatUI();
      }

      // Define a helper to clear the textarea and dispatch an input event
      const clearInput = () => {
        textarea.value = '';
        textarea.dispatchEvent(new Event('input'));
      };
      // Clear the textarea immediately on send
      clearInput();
      // Send the message
      await sendMessage(message);
      // Clear again after send in case the framework reverts it
      clearInput();
    }
  });

  // Launcher toggle (welcome/loader only on first open)
  // Modify the launcher click handler to be async so we can await
  // functions and automatically send the initial greeting when needed.
  toggleButton.addEventListener('click', async () => {
    const isOpening = !chatContainer.classList.contains('open');

    // open / close
    chatContainer.classList.toggle('open');

    if (!isOpening) return;

    // If chat already started, ensure chat UI is active and never show welcome again
    if (chatStarted) {
    activateChatUI();
    renderInitialBotMessage();
    return;
    }

    // FIRST open only
    if (!hasOpenedOnce) {
      hasOpenedOnce = true;

      // show loader
      welcomeLoader.style.display = 'block';

      // hide welcome initially
      if (newConversationScreen) newConversationScreen.style.display = 'none';
      if (welcomeHeader) welcomeHeader.style.display = 'none';

      if (welcomeTimer) clearTimeout(welcomeTimer);

      welcomeTimer = setTimeout(() => {
        // If chat started during timer, do nothing
        if (chatStarted) return;

        // hide loader, show welcome
        welcomeLoader.style.display = 'none';
        if (welcomeHeader) welcomeHeader.style.display = 'flex';
        if (newConversationScreen) newConversationScreen.style.display = 'block';
      }, 3000);
    } else {
      // After first open, do NOT show welcome again (your requirement)
      // Ensure loader hidden
      welcomeLoader.style.display = 'none';
      if (welcomeHeader) welcomeHeader.style.display = 'none';
      if (newConversationScreen) newConversationScreen.style.display = 'none';
    }

    // Automatically start a session and send the initial greeting
    // if the chat has not been started and the greeting hasn't been sent yet.
    if (!chatStarted) {
    chatStarted = true;
    removeWelcomeForever();
    activateChatUI();
    renderInitialBotMessage();
    }
  });

  // Close buttons just close; do not reset session or messages
  chatContainer.querySelectorAll('.close-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      chatContainer.classList.remove('open');

      // If chat not started, also hide welcome/loader so reopen doesn't show them again
      if (!chatStarted) {
        welcomeLoader.style.display = 'none';
        if (welcomeHeader) welcomeHeader.style.display = 'none';
        if (newConversationScreen) newConversationScreen.style.display = 'none';
      }
    });
  });
})();
