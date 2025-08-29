import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sidebar from "./Sidebar";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function ChatSection() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        { text: "Hello! I'm your AI assistant. How can I help you today?" },
      ],
    },
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!question.trim()) return;

    // add user message locally
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: question }] },
    ]);
    setQuestion("");
    setLoading(true);

    try {
      // prepare conversation history for Gemini
      const formattedMessages = [
        ...messages,
        { role: "user", parts: [{ text: question }] },
      ].map((m) => ({
        role: m.role === "bot" ? "model" : m.role, // in case old ones had "bot"
        parts: Array.isArray(m.parts) ? m.parts : [{ text: m.parts }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: formattedMessages }),
        }
      );

      const data = await res.json();
      console.log(data);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text:
                data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply",
            },
          ],
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "⚠️ Error fetching response." }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
        {/* Glassmorphism Header */}
        <div className="relative z-10 p-6  bg-black/20 border-b border-white/10 shadow-2xl">
          <Sidebar />
          <div className="flex items-center justify-center space-x-3">
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
              <pre className="text-sm text-white/60">Always here to help</pre>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto max-w-full p-6 space-y-6 relative z-10">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start max-w-full space-x-3 animate-fade-in ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{
                animation: `fadeSlideIn 0.5s ease-out ${i * 0.1}s both`,
              }}
            >
              {msg.role === "model" && (
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`relative max-w-3 md:max-w-md lg:max-w-lg p-4 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
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
                  }}
                >
                  {Array.isArray(msg.parts)
                    ? msg.parts[0]?.text || ""
                    : msg.parts || ""}
                </ReactMarkdown>

                {/* Message tail */}
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

        {/* Enhanced Input Area */}
        <div className="relative z-10 p-6 backdrop-blur-md bg-black/20 border-t border-white/10">
          <div className="flex items-center space-x-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <input
                className="w-full p-4 pr-12 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 shadow-xl"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your message here..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30">
                <kbd className="px-2 py-1 text-xs bg-black/20 rounded border border-white/10">
                  Enter
                </kbd>
              </div>
            </div>

            <button
              onClick={sendMessage}
              disabled={!question.trim() || loading}
              className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-xl text-white transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Subtle hint text */}
          <p className="text-center text-white/25 text-xs mt-3">
            Press Enter to send • AI responses are simulated
          </p>
        </div>
      </div>
    </>
  );
}
