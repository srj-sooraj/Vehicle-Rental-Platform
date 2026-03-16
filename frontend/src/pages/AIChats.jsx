import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, CarFront, Sparkles } from "lucide-react";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: { recommendation: "Hello! I am your RideHub AI Assistant. Tell me what kind of vehicle you're looking for, or any specific requirements you have, and I will find the perfect match from our premium fleet.", vehicles: [] } }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  async function askAI(e) {
    e?.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      let parsedReply;

      try {
        parsedReply = JSON.parse(data.reply);
      } catch (e) {
        parsedReply = { recommendation: data.reply, vehicles: [] };
      }

      setChatHistory(prev => [...prev, { role: 'ai', content: parsedReply }]);

    } catch (err) {
      console.error("Fetch error:", err);
      setChatHistory(prev => [...prev, { role: 'ai', content: { recommendation: "Error connecting to AI intelligence network. Please try again later.", vehicles: [] } }]);
    } finally {
      setLoading(false);
    }
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 pt-28 pb-12 flex justify-center px-6 font-sans relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
className="w-full max-w-5xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700 rounded-[3rem] flex flex-col h-[calc(100vh-140px)] shadow-[0_20px_60px_-15px_rgba(124,58,237,0.15)] relative z-10 overflow-hidden"      >
        {/* Header */}
        <div className="px-10 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-t-[3rem] shadow-sm relative z-20">
          <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-[2px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
              <Bot className="w-7 h-7 text-purple-600 absolute z-10" />
              <div className="absolute inset-0 bg-purple-100 opacity-50 mix-blend-multiply" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-gray-900">
              RideHub AI <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-sm text-gray-500 font-bold flex items-center gap-2 uppercase tracking-widest mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" /> System Online
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar bg-slate-50/30 dark:bg-gray-900/40 relative z-10">
          <AnimatePresence>
            {chatHistory.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                key={idx}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-[1.2rem] flex items-center justify-center border shadow-sm
                                    ${msg.role === 'user' ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-purple-100 border-purple-200 text-purple-600'}`}>
                  {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-5 md:p-6 rounded-[2rem] shadow-md
                                        ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-sm border border-blue-400/50'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]'
                    }`}>

                    {msg.role === 'user' ? (
                      <p className="leading-relaxed font-medium text-[15px]">{msg.content}</p>
                    ) : (
                      <div className="space-y-5">
                        <p className="leading-relaxed font-medium text-[15px] text-gray-700">{msg.content.recommendation}</p>

                        {msg.content.vehicles && msg.content.vehicles.length > 0 && (
                          <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest text-purple-600 flex items-center gap-2 mb-3">
                              <CarFront className="w-4 h-4" /> Suggested Fleet
                            </p>
                            {msg.content.vehicles.map((v, i) => (
                              <div key={i} className="flex items-center gap-3 bg-gray-50/80 px-4 py-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-default">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-sm" />
                                <span className="font-bold text-gray-800 text-sm">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest px-2">
                    {msg.role === 'user' ? 'You' : 'RideHub AI'}
                  </span>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-[1.2rem] bg-purple-100 border border-purple-200 text-purple-600 flex items-center justify-center shadow-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-[2rem] rounded-tl-sm flex items-center justify-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] h-[72px] min-w-[120px]">
                  <div className="flex gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-8 border-t border-gray-100 bg-white/80 backdrop-blur-md rounded-b-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative z-20">
          <form onSubmit={askAI} className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your perfect rental experience..."
              disabled={loading}
              className="w-full bg-white border-2 border-gray-100 rounded-3xl py-5 md:py-6 pl-8 pr-20 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/10 transition-all shadow-inner text-[15px]"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="absolute right-3 p-3.5 md:p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-purple-500/40 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-6 h-6 ml-0.5" />
            </button>
          </form>
          <p className="text-center text-[11px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
            Intelligence may occasionally suggest vehicles not available. Please verify fleet via Vehicles interface.
          </p>
        </div>

      </motion.div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }`}</style>
    </div>
  );
}

export default AIChat;