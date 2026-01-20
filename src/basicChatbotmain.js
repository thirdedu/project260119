const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/* ✅ 대화 히스토리 (맥락 유지 핵심) */
const messages = [
  {
    role: "system",
    content:
      "You are a friendly chatbot that helps users decide what to eat for lunch. " +
      "Ask about preferences such as spicy food, budget, time, and mood, and suggest suitable lunch menus."
  }
];

function addMessage(text, className) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${className}`;
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // 화면에 사용자 메시지 표시
  addMessage(`You: ${message}`, "user");
  userInput.value = "";

  // ✅ 히스토리에 사용자 메시지 추가
  messages.push({
    role: "user",
    content: message
  });

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
        }),
      }
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // 화면에 봇 메시지 표시
    addMessage(`Bot: ${reply}`, "bot");

    // ✅ 히스토리에 봇 메시지 추가
    messages.push({
      role: "assistant",
      content: reply
    });

  } catch (error) {
    addMessage("Bot: Error occurred.", "bot");
    console.error(error);
  }
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});