import { query, mutation } from "./_generated/server";

// Get all users for assignee dropdown
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Seed sample users
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if users already exist
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Users already seeded", count: existingUsers.length };
    }
    
    // Sample users based on the design
    const sampleUsers = [
      {
        name: "Anna Zhou",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
        role: "Board Member",
      },
      {
        name: "Michael Chen",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        role: "CEO",
      },
      {
        name: "Sarah Johnson",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "CFO",
      },
      {
        name: "David Williams",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        role: "Secretary",
      },
      {
        name: "Emily Davis",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        role: "Board Member",
      },
    ];
    
    for (const user of sampleUsers) {
      await ctx.db.insert("users", user);
    }
    
    return { message: "Users seeded successfully", count: sampleUsers.length };
  },
});
