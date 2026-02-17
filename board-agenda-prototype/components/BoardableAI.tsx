import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Sparkles, Send, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

const PANEL_WIDTH_EXPANDED = 384;

export default function BoardableAI() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionId, setSessionId] = useState<Id<"aiChatSessions"> | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getOrCreateSession = useMutation(api.aiChat.getOrCreateSession);
  const sendMessage = useMutation(api.aiChat.sendMessage);
  const messages = useQuery(
    api.aiChat.getMessages,
    sessionId ? { sessionId } : "skip"
  );

  useEffect(() => {
    getOrCreateSession().then((id) => {
      setSessionId(id);
      setIsInitializing(false);
    });
  }, [getOrCreateSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || !sessionId) return;

    setInputValue("");
    await sendMessage({ sessionId, content: trimmed });
  };

  const isStreaming =
    messages &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === "user";

  return (
    <>
      {/* Collapsed state: floating tab on the right edge */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed top-1/2 right-0 -translate-y-1/2 z-40 flex items-center gap-2 bg-white border border-r-0 border-slate-200 rounded-l-xl shadow-md hover:shadow-lg hover:bg-slate-50 transition-all duration-300 py-3 pl-3 pr-4"
          style={{
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          }}
          aria-label="Open Boardable AI"
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{
              background: "linear-gradient(to right, #2dd4bf, #06b6d4)",
            }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
            Boardable AI
          </span>
          <ChevronLeft className="h-4 w-4 text-slate-500 shrink-0" />
        </button>
      )}

      {/* Expanded panel - slides in from right */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] z-30 bg-white border-l border-slate-200 flex flex-col shadow-xl transition-[width,opacity] duration-300 ease-in-out ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          width: isExpanded ? PANEL_WIDTH_EXPANDED : 0,
          overflow: "hidden",
        }}
      >
        <div className="flex flex-col h-full w-full min-w-[384px]">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50/50">
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Collapse Boardable AI"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
              style={{
                background: "linear-gradient(to right, #2dd4bf, #06b6d4)",
              }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-slate-900">
                Boardable AI
              </h2>
              <p className="text-xs text-slate-500 truncate">
                Ask anything about board meetings
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 agenda-scroll">
            {isInitializing ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : !messages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: "linear-gradient(to right, #2dd4bf, #06b6d4)",
                  }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  How can I help?
                </p>
                <p className="text-xs text-slate-500 max-w-[240px]">
                  Ask me about structuring agendas, best practices, time
                  allocation, or meeting preparation.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
                        msg.role === "user"
                          ? "bg-primary-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isStreaming && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-xl px-4 py-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-slate-200 bg-white"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about board meetings..."
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none"
                disabled={!sessionId || isInitializing}
              />
              <button
                type="submit"
                disabled={
                  !inputValue.trim() || !sessionId || isInitializing || isStreaming
                }
                className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
