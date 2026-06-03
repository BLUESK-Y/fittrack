import React, { useState, useEffect, useRef } from "react";
import "./AICoach.css";
import AppNavbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import ChallengeCard from "../challenges/ChallengeCard";
import api from "../../services/api";

const AICoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const chatEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setMessages([
      {
        role: "ai",
        text: `Hi ${user?.name}! 👋 How are you feeling today?`,
        time: getTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input, time: getTime() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    if (stage === 1) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Nice! Tell me your fitness goal or what kind of workout you're looking for and I'll suggest the best plan for you! 💪",
            time: getTime(),
          },
        ]);
      }, 400);
      setStage(2);
      return;
    }

    await getRecommendations(currentInput);
    setStage("chat");
  };

  const getRecommendations = async (userInput) => {
    setLoading(true);
    try {
      const res = await api.post("/ai/recommendations", { userMessage: userInput });
      const recommendations = res.data?.recommendations || [];

      const coachText =
        recommendations.length > 0
          ? "Based on your goal, here are my top recommendations for you!"
          : "I couldn't generate recommendations right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: coachText, time: getTime() },
      ]);

      if (recommendations.length > 0) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "", time: getTime(), recommendations },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I had trouble generating recommendations. Please try again!",
          time: getTime(),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <AppNavbar />
      <div className="ai-container">
        <div className="ai-header">
          <h2>AI Workout Assistant</h2>
          <p>Hyper-personalized recommendations powered by AI.</p>
        </div>

        <div className="chat-card">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.text ? (
                  <div className={`message ${msg.role}`}>
                    <div>{msg.text}</div>
                    <span className="time">{msg.time}</span>
                  </div>
                ) : null}

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="ai-challenge-suggestions">
                    <p className="suggestion-label">Recommended for you ✨</p>
                    <div className="suggestion-cards">
                      {msg.recommendations.map((rec, i) => (
                        <div key={i} className="ai-rec-card">
                          <h4>{rec.type}</h4>
                          <p>{rec.reason}</p>
                          <div className="ai-rec-meta">
                            <span>⏱ {rec.duration} min</span>
                            <span>📅 {rec.frequency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message ai">Finding the best plan for you...</div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask AI Coach something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AICoach;
