import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import RepoInput from "./components/RepoInput";
import ChatInterface from "./components/ChatInterface";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRepoProcessed, setIsRepoProcessed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  console.log("API URL:", API_URL);

  const handleProcessRepo = async (url) => {
    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/process-repo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: url }),
      });

      const data = await response.json();

      if (response.ok) {
        setRepoUrl(url);
        setIsRepoProcessed(true);
        setMessages([
          {
            type: "system",
            content: data.message,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        setError(data.error || "Failed to process repository");
      }
    } catch (err) {
      setError("Failed to connect to the server");
      console.error("Error processing repository:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (question) => {
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Use the enhanced chat endpoint for better context retrieval
      const response = await fetch(`${API_URL}/api/chat-enhanced`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          type: "bot",
          content: data.answer,
          timestamp: new Date().toLocaleTimeString(),
          sourceDocuments: data.sourceDocuments || [],
          enhancedRetrieval: data.enhancedRetrieval || false,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          type: "error",
          content: data.error || "Failed to get response",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorMessage = {
        type: "error",
        content: "Failed to connect to the server",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleReset = () => {
    setRepoUrl("");
    setIsRepoProcessed(false);
    setMessages([]);
    setError("");
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {!isRepoProcessed ? (
          <div className="repo-section">
            <RepoInput
              onProcessRepo={handleProcessRepo}
              isProcessing={isProcessing}
              error={error}
            />
            {isProcessing && <LoadingSpinner />}
          </div>
        ) : (
          <ChatInterface
            repoUrl={repoUrl}
            messages={messages}
            onSendMessage={handleSendMessage}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
