(function () {
  /* =======================
     STYLES
  ======================= */
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
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,.15);
      overflow: hidden;
    }

    .n8n-chat-widget .chat-container.open {
      display: flex;
      flex-direction: column;
    }

    .brand-header {
      padding: 16px;
      background: var(--chat--color-primary);
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    .brand-header img { width: 32px; height: 32px; }
    .brand-title { font-weight: 600; }
    .brand-subtitle { font-size: 12px; opacity: .8; }

    .close-button {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
    }

    .chat-interface { display: none; flex-direction: column; height: 100%; }
    .chat-interface.active { display: flex; }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .chat-message {
      padding: 12px 16px;
      margin: 6px 0;
      border-radius: 12px;
      max-width: 80%;
      font-size: 14px;
    }

    .chat-message.user {
      align-self: flex-end;
      background: var(--chat--color-primary);
      color: #fff;
    }

    .chat-message.bot {
      align-self: flex-start;
      background: #f3f5f7;
      border: 1px solid #d9dee5;
    }

    .chat-input {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid #ddd;
    }

    .chat-input textarea {
      flex: 1;
      resize: none;
      padding: 10px;
      border-radius: 8px;
    }

    .chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 999px;
      background: var(--chat--color-primary);
      color: #fff;
      border: none;
      cursor: pointer;
      animation: launcherPulse 12s infinite;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  /* =======================
     CONFIG
  ======================= */
  if (window.CustomIcleanWidgetLoaded) return;
  window.CustomIcleanWidgetLoaded = true;

  const config = window.ChatWidgetConfig || {
    webhook: { url: '', route: '' },
    branding: { logo: '', name: 'iCLEAN AZ', subtitle: 'Professional Service' },
    style: { primaryColor: '#0B1F3B' }
  };

  /* =======================
     STATE
  ======================= */
  let currentSessionId = '';
  let isFirstUserMessage = true;
  let chatStarted = false;

  /* =======================
     DOM
  ======================= */
  const widget = document.createElement('div');
  widget.className = 'n8n-chat-widget';

  const chatContainer = document.createElement('div');
  chatContainer.className = 'chat-container';

  chatContainer.innerHTML = `
    <div class="chat-interface">
      <div class="brand-header">
        <img src="${config.branding.logo}">
        <div>
          <div class="brand-title">${config.branding.name}</div>
          <div class="brand-subtitle">${config.branding.subtitle}</div>
        </div>
        <button class="close-button">×</button>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input">
        <textarea placeholder="Type your message..."></textarea>
        <button>Send</button>
      </div>
    </div>
  `;

  const toggleButton = document.createElement('button');
  toggleButton.className = 'chat-toggle';
  toggleButton.textContent = 'Get a Free Quote';

  widget.appendChild(chatContainer);
  widget.appendChild(toggleButton);
  document.body.appendChild(widget);

  const chatInterface = chatContainer.querySelector('.chat-interface');
  const messages = chatContainer.querySelector('.chat-messages');
  const textarea = chatContainer.querySelector('textarea');
  const sendBtn = chatContainer.querySelector('button');

  /* =======================
     HELPERS
  ======================= */
  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function renderInitialBotMessage() {
    if (messages.children.length > 0) return;

    const bot = document.createElement('div');
    bot.className = 'chat-message bot';
    bot.textContent =
      "Hi there! I’m the virtual assistant of iCLEAN AZ. How can I help you today?";
    messages.appendChild(bot);
    scrollBottom();
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'chat-message bot';
    t.textContent = 'Typing…';
    messages.appendChild(t);
    scrollBottom();
    return t;
  }

  function activateChat() {
    chatInterface.classList.add('active');
  }

  async function startSessionIfNeeded() {
    if (currentSessionId) return;
    currentSessionId = crypto.randomUUID();
  }

  async function sendMessage(message) {
    await startSessionIfNeeded();

    const user = document.createElement('div');
    user.className = 'chat-message user';
    user.textContent = message;
    messages.appendChild(user);
    scrollBottom();

    let typing = null;
    if (!isFirstUserMessage) typing = showTyping();

    const res = await fetch(config.webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: currentSessionId,
        route: config.webhook.route,
        chatInput: message
      })
    });

    const data = await res.json();
    if (typing) typing.remove();

    const bot = document.createElement('div');
    bot.className = 'chat-message bot';
    bot.textContent = Array.isArray(data) ? data[0].output : data.output;
    messages.appendChild(bot);
    scrollBottom();

    isFirstUserMessage = false;
  }

  /* =======================
     EVENTS
  ======================= */
  toggleButton.onclick = () => {
    chatContainer.classList.add('open');
    activateChat();
    renderInitialBotMessage();
  };

  chatContainer.querySelector('.close-button').onclick = () => {
    chatContainer.classList.remove('open');
  };

  sendBtn.onclick = async () => {
    const msg = textarea.value.trim();
    if (!msg) return;
    textarea.value = '';
    await sendMessage(msg);
  };

  textarea.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });
})();
