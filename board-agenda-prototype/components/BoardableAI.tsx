import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Sparkles, Send, ChevronRight, ChevronLeft, Loader2, Trash2, FileText, Calendar, Lightbulb } from "lucide-react";
import Modal from "./Modal";

const PANEL_WIDTH_EXPANDED = 384;

interface BoardableAIProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const QUICK_PROMPTS = [
  {
    id: "pull-agenda",
    icon: FileText,
    label: "Pull agenda from the previous board meeting",
    action: "seed",
  },
  {
    id: "structure-agenda",
    icon: Calendar,
    label: "Help me structure today's agenda",
    action: "send",
  },
  {
    id: "best-practices",
    icon: Lightbulb,
    label: "Best practices for board meetings",
    action: "send",
  },
];

export default function BoardableAI({ isExpanded, onToggle }: BoardableAIProps) {
  const [sessionId, setSessionId] = useState<Id<"aiChatSessions"> | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getOrCreateSession = useMutation(api.aiChat.getOrCreateSession);
  const sendMessage = useMutation(api.aiChat.sendMessage);
  const addUserMessage = useMutation(api.aiChat.addUserMessage);
  const addAssistantMessage = useMutation(api.aiChat.addAssistantMessage);
  const clearMessages = useMutation(api.aiChat.clearMessages);
  const seedUsers = useMutation(api.users.seed);
  const seedAgendaItems = useMutation(api.agendaItems.seed);
  const agendaItems = useQuery(api.agendaItems.get);
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

  const handleClear = async () => {
    if (!sessionId) return;
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      await clearMessages({ sessionId });
    }
  };

  const handleQuickPrompt = async (prompt: typeof QUICK_PROMPTS[0]) => {
    console.log("Quick prompt clicked:", prompt.label, "Session ID:", sessionId);
    if (!sessionId) {
      console.error("No session ID available");
      return;
    }

    // Check if there are existing agenda items for seed action
    if (prompt.action === "seed" && agendaItems && agendaItems.length > 0) {
      setShowConfirmModal(true);
      return;
    }

    await executeQuickPrompt(prompt);
  };

  const executeQuickPrompt = async (prompt: typeof QUICK_PROMPTS[0]) => {
    if (!sessionId) return;

    try {
      if (prompt.action === "seed") {
        console.log("Starting seed action...");
        
        // First, add the user message (the prompt they clicked)
        console.log("Adding user message...");
        const userMsgResult = await addUserMessage({
          sessionId,
          content: prompt.label,
        });
        console.log("User message added:", userMsgResult);
        
        // Seed the demo agenda
        console.log("Seeding users...");
        const usersResult = await seedUsers();
        console.log("Users seeded:", usersResult);
        
        console.log("Seeding agenda items...");
        const agendaResult = await seedAgendaItems();
        console.log("Agenda items seeded:", agendaResult);
        
        // Then add the AI confirmation response
        console.log("Adding AI response...");
        const aiMsgResult = await addAssistantMessage({
          sessionId,
          content: "✅ Done! I've populated the agenda section with the previous board meeting items. The agenda now includes 11 items covering: Call to Order, Approval of Minutes, Financial Report, CEO Report, Market Expansion Proposal, Governance Update, Executive Compensation Review, Committee Reports, New Business, Executive Session, and Adjournment.",
        });
        console.log("AI message added:", aiMsgResult);
        console.log("Seed action completed successfully!");
      } else {
        // Send as a regular message (will trigger AI response)
        console.log("Sending regular message...");
        await sendMessage({ sessionId, content: prompt.label });
      }
    } catch (error) {
      console.error("Error handling quick prompt:", error);
      // Try to add an error message to the chat if possible
      try {
        await sendMessage({
          sessionId,
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        });
      } catch (e) {
        console.error("Failed to send error message:", e);
      }
    }
  };

  const handleConfirmSeed = async () => {
    setShowConfirmModal(false);
    const seedPrompt = QUICK_PROMPTS.find((p) => p.action === "seed");
    if (seedPrompt) {
      await executeQuickPrompt(seedPrompt);
    }
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
          onClick={() => onToggle(true)}
          className="fixed bottom-20 right-0 z-40 flex items-center gap-2 bg-white border border-r-0 border-slate-200 rounded-l-xl shadow-md hover:shadow-lg hover:bg-slate-50 transition-all duration-300 py-3 pl-3 pr-4"
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
              onClick={() => onToggle(false)}
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
            <button
              onClick={handleClear}
              disabled={!messages || messages.length === 0}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear chat history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 agenda-scroll">
            {isInitializing ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : !messages || messages.length === 0 ? (
              <div className="flex flex-col h-full">
                {/* Welcome message */}
                <div className="flex flex-col items-center justify-center pt-8 pb-6 text-center px-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: "linear-gradient(to right, #2dd4bf, #06b6d4)",
                    }}
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-base font-bold text-slate-700 mb-2">
                    How can I help?
                  </p>
                  <p className="text-xs text-slate-500 max-w-[240px]">
                    Ask me about structuring agendas, best practices, time
                    allocation, or meeting preparation.
                  </p>
                </div>

                {/* Quick prompts */}
                <div className="px-4 space-y-2">
                  <p className="text-xs font-medium text-slate-500 mb-3">Quick actions</p>
                  {QUICK_PROMPTS.map((prompt) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={prompt.id}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 shrink-0">
                          <Icon className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="text-sm text-slate-700 leading-relaxed">
                          {prompt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSeed}
        title="Replace Existing Agenda?"
        message="This will discard all current agenda items and load the previous meeting's agenda. This action cannot be undone."
        confirmText="Replace Agenda"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}
