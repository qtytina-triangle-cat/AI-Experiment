import { internalAction, internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

const BOARDABLE_AI_SYSTEM_PROMPT = `You are Boardable AI, a helpful assistant for creating and organizing board meetings. You help users with:
- Structuring meeting agendas
- Best practices for board meeting preparation
- Time allocation for agenda items
- Writing clear meeting minutes
- Inviting and managing meeting participants
- Recording and documenting decisions

Be concise, professional, and provide actionable advice. When relevant, suggest specific agenda structures or templates.`;

// Get or create the current chat session (single session per app for simplicity)
export const getOrCreateSession = mutation({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db
      .query("aiChatSessions")
      .withIndex("by_created")
      .order("desc")
      .take(1);

    if (sessions.length > 0) {
      return sessions[0]._id;
    }

    return await ctx.db.insert("aiChatSessions", {
      createdAt: Date.now(),
    });
  },
});

// Get all messages for a session
export const getMessages = query({
  args: { sessionId: v.id("aiChatSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiChatMessages")
      .withIndex("by_session", (q) =>
        q.eq("sessionId", args.sessionId)
      )
      .order("asc")
      .collect();
  },
});

// Add user message and trigger AI response
export const sendMessage = mutation({
  args: {
    sessionId: v.id("aiChatSessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("aiChatMessages", {
      sessionId: args.sessionId,
      role: "user",
      content: args.content,
      createdAt: Date.now(),
    });

    // Schedule the AI action to run
    await ctx.scheduler.runAfter(0, internal.aiChat.generateResponse, {
      sessionId: args.sessionId,
      userMessageId: messageId,
    });

    return messageId;
  },
});

// Clear all messages in a session
export const clearMessages = mutation({
  args: { sessionId: v.id("aiChatSessions") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("aiChatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

// Internal mutation to save assistant message (called from action)
export const saveAssistantMessage = internalMutation({
  args: {
    sessionId: v.id("aiChatSessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiChatMessages", {
      sessionId: args.sessionId,
      role: "assistant",
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

// Internal action to call OpenAI API and save response
export const generateResponse = internalAction({
  args: {
    sessionId: v.id("aiChatSessions"),
    userMessageId: v.id("aiChatMessages"),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      await ctx.runMutation(internal.aiChat.saveAssistantMessage, {
        sessionId: args.sessionId,
        content: "Boardable AI is not configured. Please set OPENAI_API_KEY in your Convex dashboard (Settings → Environment Variables).",
      });
      return;
    }

    // Get chat history for context
    const messages = await ctx.runQuery(api.aiChat.getMessages, {
      sessionId: args.sessionId,
    });

    const openAiMessages = [
      { role: "system" as const, content: BOARDABLE_AI_SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: openAiMessages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        await ctx.runMutation(internal.aiChat.saveAssistantMessage, {
          sessionId: args.sessionId,
          content: `Sorry, I encountered an error: ${error}. Please check your OpenAI API configuration.`,
        });
        return;
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const assistantContent =
        data.choices?.[0]?.message?.content ??
        "I'm sorry, I couldn't generate a response. Please try again.";

      await ctx.runMutation(internal.aiChat.saveAssistantMessage, {
        sessionId: args.sessionId,
        content: assistantContent,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      await ctx.runMutation(internal.aiChat.saveAssistantMessage, {
        sessionId: args.sessionId,
        content: `Sorry, something went wrong: ${message}. Please try again.`,
      });
    }
  },
});
