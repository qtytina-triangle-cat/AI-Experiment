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

// Seed 3 starter agenda items for beginning/empty state (best practices)
export const seedStarter = mutation({
  args: {},
  handler: async (ctx) => {
    const existingItems = await ctx.db.query("agendaItems").collect();
    if (existingItems.length > 0) {
      return { message: "Agenda already has items", count: existingItems.length };
    }

    // Seed users first if needed
    let users = await ctx.db.query("users").collect();
    if (users.length === 0) {
      const sampleUsers = [
        { name: "Anna Zhou", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna", role: "Board Member" },
        { name: "Michael Chen", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael", role: "CEO" },
        { name: "Sarah Johnson", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", role: "CFO" },
        { name: "David Williams", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", role: "Secretary" },
        { name: "Emily Davis", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", role: "Board Member" },
      ];
      for (const user of sampleUsers) {
        await ctx.db.insert("users", user);
      }
      users = await ctx.db.query("users").collect();
    }

    const ceo = users.find((u) => u.role === "CEO");
    const secretary = users.find((u) => u.role === "Secretary");

    const starterItems = [
      {
        title: "Call to Order & Welcome",
        description: "Open the meeting, confirm quorum, and welcome all attendees. Review the agenda and meeting objectives.",
        duration: 5,
        assigneeId: ceo?._id,
        order: 0,
      },
      {
        title: "Approval of Previous Meeting Minutes",
        description: "Review and approve the minutes from the last board meeting. Address any corrections or amendments before formal approval.",
        duration: 10,
        assigneeId: secretary?._id,
        order: 1,
      },
      {
        title: "Chair/CEO Report",
        description: "Executive summary of organizational performance, key initiatives, and strategic updates. Opportunity for board discussion and questions.",
        duration: 15,
        assigneeId: ceo?._id,
        order: 2,
      },
    ];

    for (const item of starterItems) {
      await ctx.db.insert("agendaItems", item);
    }

    return { message: "Starter agenda seeded successfully", count: starterItems.length };
  },
});

// Clear all agenda items
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("agendaItems").collect();
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    return { message: "Cleared all agenda items", count: items.length };
  },
});

// Seed demo agenda items
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing items first
    const existingItems = await ctx.db.query("agendaItems").collect();
    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }

    // Get users to assign to agenda items
    const users = await ctx.db.query("users").collect();
    if (users.length === 0) {
      return { message: "Please seed users first", count: 0 };
    }

    // Demo agenda items for a typical board meeting
    const demoItems = [
      {
        title: "Call to Order & Welcome",
        description: "Open the meeting, confirm quorum, and welcome all attendees. Review the agenda and meeting objectives.",
        duration: 5,
        assigneeId: users.find(u => u.role === "CEO")?._id,
        order: 0,
      },
      {
        title: "Approval of Previous Minutes",
        description: "Review and approve the minutes from the last board meeting held on August 15, 2023. Address any corrections or amendments.",
        duration: 10,
        assigneeId: users.find(u => u.role === "Secretary")?._id,
        order: 1,
      },
      {
        title: "Financial Report - Q3 2023",
        description: "Present Q3 financial statements including revenue, expenses, cash flow, and balance sheet. Discuss year-over-year performance and budget variance analysis.",
        duration: 20,
        assigneeId: users.find(u => u.role === "CFO")?._id,
        order: 2,
      },
      {
        title: "CEO Report & Strategic Updates",
        description: "Overview of company performance, key initiatives, market conditions, and strategic priorities for Q4. Include updates on product development and customer acquisition.",
        duration: 25,
        assigneeId: users.find(u => u.role === "CEO")?._id,
        order: 3,
      },
      {
        title: "New Market Expansion Proposal",
        description: "Present and discuss the proposal to expand into the European market. Review market research, financial projections, resource requirements, and timeline.",
        duration: 30,
        assigneeId: users.find(u => u.role === "Board Member")?._id,
        order: 4,
      },
      {
        title: "Governance & Compliance Update",
        description: "Review compliance status, regulatory changes, risk management updates, and any governance policy revisions.",
        duration: 15,
        assigneeId: users.find(u => u.role === "Secretary")?._id,
        order: 5,
      },
      {
        title: "Executive Compensation Review",
        description: "Review executive compensation packages, performance metrics, and proposed adjustments for the upcoming fiscal year.",
        duration: 20,
        assigneeId: users[users.length - 1]?._id, // Emily Davis
        order: 6,
      },
      {
        title: "Committee Reports",
        description: "Brief reports from Audit Committee, Compensation Committee, and Nominating & Governance Committee on recent activities and recommendations.",
        duration: 15,
        order: 7,
      },
      {
        title: "New Business & Open Discussion",
        description: "Address any new business items, questions from board members, and open discussion on strategic matters.",
        duration: 15,
        order: 8,
      },
      {
        title: "Executive Session (Board Only)",
        description: "Private session for board members to discuss sensitive matters without management present.",
        duration: 20,
        order: 9,
      },
      {
        title: "Adjournment",
        description: "Confirm next meeting date and adjourn the meeting.",
        duration: 5,
        assigneeId: users.find(u => u.role === "CEO")?._id,
        order: 10,
      },
    ];

    for (const item of demoItems) {
      await ctx.db.insert("agendaItems", item);
    }

    return { message: "Agenda items seeded successfully", count: demoItems.length };
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
