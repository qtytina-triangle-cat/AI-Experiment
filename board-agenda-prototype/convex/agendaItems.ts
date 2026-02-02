import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all agenda items ordered by sort order
export const get = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("agendaItems")
      .withIndex("by_order")
      .collect();
    
    // Fetch assignee details for each item
    const itemsWithAssignees = await Promise.all(
      items.map(async (item) => {
        let assignee = null;
        if (item.assigneeId) {
          assignee = await ctx.db.get(item.assigneeId);
        }
        return { ...item, assignee };
      })
    );
    
    return itemsWithAssignees;
  },
});

// Get a single agenda item by ID
export const getById = query({
  args: { id: v.id("agendaItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return null;
    
    let assignee = null;
    if (item.assigneeId) {
      assignee = await ctx.db.get(item.assigneeId);
    }
    return { ...item, assignee };
  },
});

// Create a new agenda item
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    duration: v.number(),
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Get the highest order value
    const items = await ctx.db
      .query("agendaItems")
      .withIndex("by_order")
      .collect();
    
    const maxOrder = items.length > 0 
      ? Math.max(...items.map(item => item.order)) 
      : -1;
    
    const id = await ctx.db.insert("agendaItems", {
      title: args.title,
      description: args.description,
      duration: args.duration,
      assigneeId: args.assigneeId,
      order: maxOrder + 1,
    });
    
    return id;
  },
});

// Update an existing agenda item
export const update = mutation({
  args: {
    id: v.id("agendaItems"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const filteredUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }
    
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Delete an agenda item
export const remove = mutation({
  args: { id: v.id("agendaItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Reorder agenda items
export const reorder = mutation({
  args: {
    itemId: v.id("agendaItems"),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) return;
    
    const oldOrder = item.order;
    const newOrder = args.newOrder;
    
    if (oldOrder === newOrder) return;
    
    // Get all items
    const items = await ctx.db
      .query("agendaItems")
      .withIndex("by_order")
      .collect();
    
    // Update orders for affected items
    for (const otherItem of items) {
      if (otherItem._id === args.itemId) {
        await ctx.db.patch(otherItem._id, { order: newOrder });
      } else if (oldOrder < newOrder) {
        // Moving down: shift items between old and new position up
        if (otherItem.order > oldOrder && otherItem.order <= newOrder) {
          await ctx.db.patch(otherItem._id, { order: otherItem.order - 1 });
        }
      } else {
        // Moving up: shift items between new and old position down
        if (otherItem.order >= newOrder && otherItem.order < oldOrder) {
          await ctx.db.patch(otherItem._id, { order: otherItem.order + 1 });
        }
      }
    }
  },
});
