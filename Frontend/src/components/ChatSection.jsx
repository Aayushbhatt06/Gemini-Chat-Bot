import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND || "http://localhost:3000";

export default function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionName, setCurrentSessionName] = useState("New Session");
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Added refresh state

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load user from localStorage on component mount
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserId(user.id);
          setUserInfo(user);
          return;
        }

        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          return;
        }

        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.id) {
              setUserId(payload.id);
              return;
            }
          } catch (e) {
            console.error("Failed to extract userId from token:", e);
          }
        }

        setError("Please log in to access chat");
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        setError("Error loading user data");
      }
    };

    getUserFromStorage();
  }, []);

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      return response.ok;
    } catch (err) {
      return false;
    }
  };

  // Load all sessions for the user
  const loadUserSessions = async () => {
    if (!backendAvailable || !userId) return [];

    try {
      const res = await fetch(`${BACKEND_URL}/history/user/${userId}/sessions`);
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        if (!data.sessions[0]) {
          createNewSession();
        }
        setSessions(data.sessions);
        return data.sessions;
      }

      setSessions([]);
      return [];
    } catch (err) {
      console.error("Error loading sessions:", err);
      setSessions([]);
      return [];
    }
  };

  // Added: Manual refresh function for the refresh button
  const handleRefreshSessions = async () => {
    if (refreshing || !backendAvailable || !userId) return;

    setRefreshing(true);
    try {
      await loadUserSessions();
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load a single session by ID
  const loadSessionFromBackend = async (sessionIdToLoad) => {
    if (!backendAvailable || !sessionIdToLoad || !userId) return null;

    try {
      const url = `${BACKEND_URL}/history/session/${sessionIdToLoad}?userId=${userId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      return data.success && data.session ? data.session : null;
    } catch (err) {
      console.error("Error loading session:", err);
      return null;
    }
  };

  // Save message to backend
  const saveMessageToBackend = async (message) => {
    if (!backendAvailable || !sessionId || !userId) return false;

    try {
      const res = await fetch(`${BACKEND_URL}/history/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sessionId,
          message: {
            ...message,
            timestamp: message.timestamp || new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error("Error saving message:", err);
      return false;
    }
  };

  // Create a new session
  const createNewSession = async (sessionName = null) => {
    if (!backendAvailable || !userId) return null;

    const name =
      sessionName ||
      `Session ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    const defaultMessage = {
      role: "model",
      parts: [
        { text: "Hello! I'm your AI assistant. How can I help you today?" },
      ],
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/history/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sessionName: name }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.success && data.session) {
        setSessionId(data.session._id);
        setCurrentSessionName(data.session.sessionName);
        setMessages([defaultMessage]);
        await saveMessageToBackend(defaultMessage);
        await loadUserSessions();
        return data.session._id;
      }
      return null;
    } catch (err) {
      console.error("Error creating session:", err);
      return null;
    }
  };

  // Switch to a different session
  const switchToSession = async (targetSessionId) => {
    if (targetSessionId === sessionId) return;

    const sessionData = await loadSessionFromBackend(targetSessionId);
    if (sessionData) {
      setSessionId(sessionData._id);
      setCurrentSessionName(sessionData.sessionName);

      if (sessionData.messages && sessionData.messages.length > 0) {
        setMessages(sessionData.messages);
      } else {
        const welcomeMessage = {
          role: "model",
          parts: [
            { text: "Hello! I'm your AI assistant. How can I help you today?" },
          ],
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    }
  };

  // Delete session
  const deleteSession = async (sessionIdToDelete) => {
    if (!sessionIdToDelete || !backendAvailable) return;

    try {
      await fetch(`${BACKEND_URL}/history/delete/${sessionIdToDelete}`, {
        method: "GET",
      });

      const updated = await loadUserSessions();
      if (sessionIdToDelete === sessionId) {
        if (updated.length > 0) {
          await switchToSession(updated[0]._id);
        } else {
          await createNewSession();
        }
      }
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  // Initialize chat
  useEffect(() => {
    if (!userId) return;

    const initializeChat = async () => {
      setInitializing(true);
      setError("");

      try {
        const isBackendHealthy = await checkBackendHealth();
        setBackendAvailable(isBackendHealthy);

        if (!isBackendHealthy) {
          setError("Backend server is not available");
          setInitializing(false);
          return;
        }

        const userSessions = await loadUserSessions();

        if (userSessions && userSessions.length > 0) {
          await switchToSession(userSessions[0]._id);
        } else {
          await createNewSession();
        }
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to initialize chat");

        try {
          await createNewSession();
        } catch (fallbackErr) {
          console.error("Fallback session creation failed:", fallbackErr);
        }
      } finally {
        setInitializing(false);
      }
    };

    initializeChat();
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to AI
  const sendMessage = async () => {
    if (!question.trim() || loading || !backendAvailable) return;

    const userMessage = {
      role: "user",
      parts: [{ text: question }],
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    await saveMessageToBackend(userMessage);

    try {
      const currentMessages = [...messages, userMessage];
      const formattedMessages = currentMessages.map((m) => ({
        role: m.role === "bot" ? "model" : m.role,
        parts: Array.isArray(m.parts) ? m.parts : [{ text: m.parts }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: formattedMessages }),
        }
      );

      if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      const modelMessage = {
        role: "model",
        parts: [{ text: reply || "⚠️ No response from Gemini" }],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, modelMessage]);
      await saveMessageToBackend(modelMessage);
    } catch (err) {
      const errorMessage = {
        role: "model",
        parts: [{ text: `⚠️ Error: ${err.message}` }],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessageToBackend(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNewSession = async () => {
    await createNewSession();
  };
  const Logout = () => {
    localStorage.removeItem("authToken");
  };
  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const truncateText = (text, maxLength = 30) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + "...";

  // Show loading screen while initializing
  if (initializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading your chat sessions...</p>
          {userInfo && (
            <p className="text-sm text-white/70 mt-2">
              Welcome back, {userInfo.name}!
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show error screen if no user or critical error
  if (error && !userId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="text-white text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarExpanded ? "w-80" : "w-0"
        } transition-all duration-300 ease-in-out bg-black/30 backdrop-blur-sm border-r border-white/10 overflow-hidden flex flex-col`}
      >
        {sidebarExpanded && (
          <>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
                  Chat Sessions
                  <span className="text-xs text-white/40 ml-2">
                    ({sessions.length})
                  </span>
                </h2>

                {/* Added: Refresh Button */}
                <button
                  onClick={handleRefreshSessions}
                  disabled={refreshing || !backendAvailable}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  title="Refresh sessions"
                >
                  <RotateCcw
                    className={`w-4 h-4 text-white transition-transform duration-300 ${
                      refreshing ? "animate-spin" : "group-hover:rotate-180"
                    }`}
                  />
                </button>
              </div>

              {userInfo && (
                <p className="text-xs text-white/60 mt-1">
                  Welcome, {userInfo.name}
                </p>
              )}
              <p className="text-xs text-white/30">
                Backend: {backendAvailable ? "✓ Connected" : "✗ Disconnected"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {refreshing ? (
                <div className="text-white/60 text-sm text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
                  Refreshing sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-white/60 text-sm text-center py-8">
                  No sessions yet
                  <br />
                  <span className="text-xs text-white/40">
                    Create your first session to get started
                  </span>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session._id}
                    className={`group flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                      session._id === sessionId
                        ? "bg-cyan-500/20 border border-cyan-400/30"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => switchToSession(session._id)}
                    >
                      <h3
                        className={`text-sm font-medium truncate ${
                          session._id === sessionId
                            ? "text-cyan-300"
                            : "text-white"
                        }`}
                      >
                        {truncateText(session.sessionName)}
                      </h3>
                      <p className="text-xs text-white/60 truncate">
                        {session.messages?.length || 0} messages
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(
                          session.updatedAt || session.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-opacity"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleNewSession}
                disabled={loading}
                className="w-full p-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors flex items-center justify-center text-cyan-400 font-medium disabled:opacity-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Session
              </button>
            </div>
          </>
        )}
      </div>

      {/* Rest of the component remains the same... */}
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="relative z-10 p-6 bg-black/20 border-b border-white/10 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarExpanded ? (
                  <ChevronLeft className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" />
                )}
              </button>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-sm text-white/60">
                  {userInfo ? `Welcome, ${userInfo.name}` : `User: ${userId}`} •
                  {truncateText(currentSessionName, 30)} •
                  {backendAvailable ? "Connected" : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {sessions.length > 0 && (
                <div className="text-white/40 text-sm">
                  {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                </div>
              )}
              <button
                onClick={handleNewSession}
                disabled={loading}
                className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors disabled:opacity-50"
                title="New Session"
              >
                <Plus className="w-5 h-5 text-cyan-400" />
              </button>
              <button
                onClick={() => {
                  Logout();
                  window.location.href = "/login";
                }}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 text-sm"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto max-w-full p-6 space-y-6 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={`${sessionId}-${i}`}
              className={`flex items-start max-w-full space-x-3 animate-fade-in ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "model" && (
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`relative max-w-xs md:max-w-md lg:max-w-lg p-4 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white ml-auto"
                    : "bg-black/20 border border-white/10 text-white mr-auto"
                }`}
              >
                {msg.role === "model" && (
                  <Sparkles
                    className="absolute -top-2 -left-2 w-5 h-5 text-yellow-400 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                )}

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-cyan-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="list-disc ml-5" {...props} />
                    ),
                    // ✅ Fix for code blocks
                    code: ({ node, inline, className, children, ...props }) => {
                      return inline ? (
                        <code
                          className="bg-black/30 px-1 py-0.5 rounded text-pink-400 font-mono break-words"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-x-auto max-w-full">
                          <code className="font-mono text-sm text-white break-words whitespace-pre-wrap">
                            {children}
                          </code>
                        </pre>
                      );
                    },
                  }}
                >
                  {Array.isArray(msg.parts)
                    ? msg.parts[0]?.text || ""
                    : msg.parts || ""}
                </ReactMarkdown>

                <div
                  className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                    msg.role === "user"
                      ? "right-[-6px] bg-gradient-to-r from-cyan-500 to-blue-600"
                      : "left-[-6px] bg-black/20 border-l border-t border-white/10"
                  }`}
                ></div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 p-6 backdrop-blur-md bg-black/20 border-t border-white/10">
          <div className="flex items-center space-x-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <input
                className="w-full p-4 pr-12 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 shadow-xl disabled:opacity-50"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your message here..."
                onKeyDown={handleKeyDown}
                disabled={loading || !backendAvailable}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30">
                <kbd className="px-2 py-1 text-xs bg-black/20 rounded border border-white/10">
                  Enter
                </kbd>
              </div>
            </div>

            <button
              onClick={sendMessage}
              disabled={!question.trim() || loading || !backendAvailable}
              className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-xl text-white transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>

          <p className="text-center text-white/25 text-xs mt-3">
            Press Enter to send • All messages synced to database • AI powered
            by Gemini
            {!backendAvailable && " • ⚠️ Backend offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
