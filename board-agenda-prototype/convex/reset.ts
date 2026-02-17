import { mutation } from "./_generated/server";

export const resetPrototype = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Delete all agenda items
    const agendaItems = await ctx.db.query("agendaItems").collect();
    for (const item of agendaItems) {
      await ctx.db.delete(item._id);
    }

    // 2. Delete all chat messages
    const chatMessages = await ctx.db.query("aiChatMessages").collect();
    for (const msg of chatMessages) {
      await ctx.db.delete(msg._id);
    }

    // 3. Delete all chat sessions
    const chatSessions = await ctx.db.query("aiChatSessions").collect();
    for (const session of chatSessions) {
      await ctx.db.delete(session._id);
    }

    // 4. Delete all users
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }

    return "Prototype reset successfully";
  },
});
