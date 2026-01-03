import React, { useState, useEffect } from "react";
import {
  Bot,
  MessageSquare,
  Database,
  Sparkles,
  Zap,
  Lock,
  ChevronDown,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GeminiChatLanding = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Persistent Chat Sessions",
      description:
        "All your conversations are saved in MongoDB. Access your chat history anytime, from anywhere. Never lose an important conversation again.",
      gradient: "from-cyan-500 to-blue-600",
      color: "cyan",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Session Management",
      description:
        "Organize conversations into sessions. Create, switch, and delete sessions seamlessly. Each session maintains its own context and history.",
      gradient: "from-blue-500 to-purple-600",
      color: "blue",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Gemini AI Powered",
      description:
        "Leveraging Google's latest Gemini 2.5 Flash model for intelligent, context-aware responses. Get accurate answers to complex questions.",
      gradient: "from-purple-500 to-pink-600",
      color: "purple",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Sync",
      description:
        "Every message is instantly synced to the database. Switch devices without losing context. Your conversations follow you everywhere.",
      gradient: "from-green-500 to-teal-600",
      color: "green",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "User Authentication",
      description:
        "Secure user authentication system. Your chats are private and only accessible to you. Complete data privacy guaranteed.",
      gradient: "from-orange-500 to-red-600",
      color: "orange",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Context-Aware AI",
      description:
        "The AI remembers your entire conversation within a session. Get relevant, personalized responses based on your chat history.",
      gradient: "from-indigo-500 to-blue-600",
      color: "indigo",
    },
  ];

  const capabilities = [
    {
      title: "Multi-Session Support",
      items: [
        "Create unlimited chat sessions",
        "Switch between sessions instantly",
        "Each session maintains independent context",
        "Delete sessions when no longer needed",
      ],
    },
    {
      title: "Smart Data Persistence",
      items: [
        "MongoDB-powered storage",
        "Automatic message sync",
        "Session metadata tracking",
        "Timestamp for every message",
      ],
    },
    {
      title: "Rich User Experience",
      items: [
        "Markdown support for formatting",
        "Code syntax highlighting",
        "Smooth animations and transitions",
        "Responsive design for all devices",
      ],
    },
  ];

  const techStack = [
    { name: "React", emoji: "⚛️", color: "from-cyan-400 to-blue-500" },
    { name: "Node.js", emoji: "🟢", color: "from-green-400 to-emerald-500" },
    { name: "MongoDB", emoji: "🍃", color: "from-green-500 to-teal-500" },
    { name: "Gemini AI", emoji: "✨", color: "from-purple-400 to-pink-500" },
    { name: "Express", emoji: "🚀", color: "from-blue-400 to-indigo-500" },
    { name: "Tailwind", emoji: "🎨", color: "from-cyan-400 to-blue-400" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setShowMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/40 backdrop-blur-md shadow-2xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Gemini Chat AI
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("features")}
                className="text-white hover:text-cyan-400 transition text-sm font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("capabilities")}
                className="text-white hover:text-cyan-400 transition text-sm font-medium"
              >
                Capabilities
              </button>
              <button
                onClick={() => scrollToSection("tech")}
                className="text-white hover:text-cyan-400 transition text-sm font-medium"
              >
                Technology
              </button>
              <button
                onClick={() => {
                  navigate("/home");
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              {showMenu ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden pb-4 space-y-2 border-t border-white/10 mt-2 pt-4">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("capabilities")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition"
              >
                Capabilities
              </button>
              <button
                onClick={() => scrollToSection("tech")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition"
              >
                Technology
              </button>
              <button
                onClick={() => {
                  navigate("/home");
                }}
                className="w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full font-semibold mt-2"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="animate-fadeIn">
            {/* Icon with Animation */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-gray-900 animate-ping"></div>
                <Sparkles
                  className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Chat with{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Gemini AI
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
              Experience intelligent conversations with persistent chat history.
              Every message saved, every session organized, every interaction
              remembered.
            </p>

            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
                <div className="text-3xl font-bold text-cyan-400">∞</div>
                <div className="text-sm text-white/70">Unlimited Sessions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
                <div className="text-3xl font-bold text-blue-400">100%</div>
                <div className="text-sm text-white/70">Data Persistence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
                <div className="text-3xl font-bold text-purple-400">⚡</div>
                <div className="text-sm text-white/70">Real-time Sync</div>
              </div>
            </div>

            <div
              onClick={() => {
                navigate("/home");
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2">
                Start Chatting <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:scale-105 w-full sm:w-auto">
                View Demo
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Built with cutting-edge technology for the best chat experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-black/30 hover:border-white/20 transition-all transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg text-white group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section
        id="capabilities"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Core Capabilities
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Everything you need for intelligent, persistent conversations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-cyan-400/50 transition-all"
              >
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                  {capability.title}
                </h3>
                <ul className="space-y-3">
                  {capability.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Simple, intuitive, and powerful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign In",
                desc: "Authenticate securely with your account",
                icon: <Lock />,
              },
              {
                step: "2",
                title: "Create Session",
                desc: "Start a new chat session or continue existing ones",
                icon: <MessageSquare />,
              },
              {
                step: "3",
                title: "Chat with AI",
                desc: "Ask questions and get intelligent responses",
                icon: <Bot />,
              },
              {
                step: "4",
                title: "Auto-Save",
                desc: "Every message is automatically saved to MongoDB",
                icon: <Database />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Built with Modern Tech
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Powered by the latest technologies for optimal performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-110 border border-white/20 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">
                  {tech.emoji}
                </div>
                <h4 className="text-white font-bold text-lg">{tech.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Chatting?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Experience the power of persistent AI conversations today
          </p>
          <button
            onClick={() => {
              navigate("/home");
            }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-4 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:scale-105"
          >
            Get Started Now <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Gemini Chat AI</span>
          </div>
          <p className="text-white/60 text-sm">
            Powered by Google Gemini AI • MongoDB Persistence • Built with React
          </p>
          <p className="text-white/40 text-xs mt-2">
            &copy; 2026 Gemini Chat AI. All conversations are securely stored
            and private.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GeminiChatLanding;
