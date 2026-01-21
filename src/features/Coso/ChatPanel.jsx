import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPanel.module.scss";
import { log } from "three";

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Xin chào! Tôi có thể giúp bạn hiểu về mô hình 3D này. Hãy đặt câu hỏi bất kỳ lúc nào!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // TODO: Replace with your actual API endpoint
      // Example: OpenAI API, Gemini API, or your backend API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAS3UlejIAKBVfjiBk-c4VBFqhbTyHspCw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: input }],
              },
            ],
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        log(data);
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          text:
            data.candidates[0].content.parts[0].text ||
            "Xin lỗi, tôi không thể xử lý yêu cầu của bạn.",
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: "bot",
          text: "Lỗi kết nối. Vui lòng thử lại.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối API.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.header}>
        <h3>AI Assistant</h3>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${styles[msg.type]}`}>
            <div className={styles.messageBubble}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.messageBubble}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi..."
          disabled={loading}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={styles.sendBtn}
        >
          {loading ? "..." : "Gửi"}
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
