(function () {
  /* =========================
     STYLES
  ========================== */
  const styles = `
    .n8n-chat-widget {
      --chat--color-primary: var(--n8n-chat-primary-color, #0B1F3B);
      --chat--color-secondary: var(--n8n-chat-secondary-color, #0B1F3B);
      --chat--color-background: var(--n8n-chat-background-color, #FFFFFF);
      --chat--color-font: var(--n8n-chat-font-color, #0B1F3B);
      font-family: 'Poppins', sans-serif;
    }

    @keyframes launcherPulse {
      0% { box-shadow: 0 10px 30px rgba(11,31,59,.35); }
      50% { box-shadow: 0 12px 36px rgba(11,31,59,.45); transform: translateY(-1px); }
      100% { box-shadow: 0 10px 30px rgba(11,31,59,.35); }
    }

    .n8n-chat-widget .chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: none;
      width: 400px;
      height: 600px;
      max-height: 80vh;
      background: var(--chat--color-background);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(11,31,59,.15);
      overflow: hidden;
      z-index: 1000;
    }

    .n8n-chat-widget .chat-container.open {
      display: flex;
      flex-direction: column;
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
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .n8n-chat-widget .chat-message {
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
      color: #000;
    }

    .n8n-chat-widget .chat-input {
      padding: 16px;
      border-top: 1px solid #ddd;
      display: flex;
      gap: 8px;
    }

    .n8n-chat-widget .chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      height: 56px;
      padding: 0 20px;
      border-radius: 999px;
      background: var(--chat--color-primary);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: launcherPulse 12s infinite;
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  /* =========================
     CONFIG / STATE
  ========================== */
  const config = window.ChatWidgetConfig || { webhook: {} };

  let currentSessionId = "";
  let chatStarted = false;
  let isInitialMessage = true;

  /* =========================
     DOM
  ========================== */
  const widget = document.createElement("div");
  widget.className = "n8n-chat-widget";

  const chatContainer = document.createElement("div");
  chatContainer.className = "chat-container";

  const chatInterface = document.createElement("div");
  chatInterface.className = "chat-interface";

  const messages = document.createElement("div");
  messages.className = "chat-messages";

  const inputWrap = document.createElement("div");
  inputWrap.className = "chat-input";

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Type your message…";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";

  inputWrap.append(textarea, sendBtn);
  chatInterface.append(messages, inputWrap);
  chatContainer.append(chatInterface);

  const toggle = document.createElement("button");
  toggle.className = "chat-toggle";
  toggle.textContent = "Get a Free Quote";

  widget.append(chatContainer, toggle);
  document.body.appendChild(widget);

  /* =========================
     HELPERS
  ========================== */
  const uuid = () => crypto.randomUUID();

  const scrollBottom = () =>
    (messages.scrollTop = messages.scrollHeight);

  const renderInitialBotMessage = () => {
    if (messages.children.length) return;
    const msg = document.createElement("div");
    msg.className = "chat-message bot";
    msg.textContent =
      "Hi there! I’m the virtual assistant of iCLEAN AZ. How can I help you today?";
    messages.appendChild(msg);
    scrollBottom();
  };

  const showTyping = () => {
    const t = document.createElement("div");
    t.className = "chat-message bot";
    t.textContent = "Typing…";
    messages.appendChild(t);
    scrollBottom();
    return t;
  };

  /* =========================
     SESSION
  ========================== */
  async function ensureSession() {
    if (currentSessionId) return;
    currentSessionId = uuid();
    await fetch(config.webhook.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { action: "loadPreviousSession", sessionId: currentSessionId }
      ])
    });
  }

  /* =========================
     SEND MESSAGE
  ========================== */
  async function sendMessage(text) {
    await ensureSession();

    const user = document.createElement("div");
    user.className = "chat-message user";
    user.textContent = text;
    messages.appendChild(user);
    scrollBottom();

    let typing = null;
    if (!isInitialMessage) typing = showTyping();

    try {
      const res = await fetch(config.webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: currentSessionId,
          chatInput: text
        })
      });

      const data = await res.json();

      if (typing) typing.remove();

      const bot = document.createElement("div");
      bot.className = "chat-message bot";
      bot.textContent = Array.isArray(data) ? data[0].output : data.output;
      messages.appendChild(bot);
      scrollBottom();

      isInitialMessage = false;
    } catch (e) {
      if (typing) typing.remove();
      console.error(e);
    }
  }

  /* =========================
     EVENTS
  ========================== */
  toggle.onclick = () => {
    chatContainer.classList.toggle("open");
    chatInterface.classList.add("active");

    if (!chatStarted) {
      chatStarted = true;
      renderInitialBotMessage();
    }
  };

  sendBtn.onclick = () => {
    const v = textarea.value.trim();
    if (!v) return;
    textarea.value = "";
    sendMessage(v);
  };

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });
})();
