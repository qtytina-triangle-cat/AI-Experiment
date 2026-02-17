import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agendaItems: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    duration: v.number(), // in minutes
    assigneeId: v.optional(v.id("users")),
    order: v.number(), // sort order
  }).index("by_order", ["order"]),

  users: defineTable({
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.optional(v.string()),
  }),

  // Boardable AI chat - sessions and messages
  aiChatSessions: defineTable({
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  aiChatMessages: defineTable({
    sessionId: v.id("aiChatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_session", ["sessionId", "createdAt"]),
});
