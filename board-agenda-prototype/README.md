# Board Meeting Agenda Builder Prototype

An interactive prototype for board admins to manage meeting agendas. Built with Next.js, Convex, and Tailwind CSS.

## Features

- **Boardable AI** – Collapsible AI assistant panel (right side) powered by ChatGPT for questions about creating board meetings
- **Create agenda items** with title, description, duration, and assignee
- **Edit existing items** inline with pre-filled forms
- **Delete items** with hover-visible controls
- **Real-time updates** powered by Convex
- **Auto-calculated start times** based on item durations
- **Assignee selection** from a list of board members

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**

   ```bash
   cd board-agenda-prototype
   npm install
   ```

2. **Set up Convex:**

   ```bash
   npx convex dev
   ```

   This will prompt you to log in (via GitHub) and create a new Convex project.
   It will automatically create a `.env.local` file with your deployment URL.

3. **Boardable AI (optional):** To enable the AI assistant, add your OpenAI API key in the Convex dashboard:
   - Go to [dashboard.convex.dev](https://dashboard.convex.dev) → Your Project → Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

4. **Seed sample users:**

   Once the app is running, click the "Load sample users for assignees" link
   in the empty agenda state to populate the users table.

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **Open the app:**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating an Agenda Item

1. Click the "+ Add item" button at the bottom of the agenda section
2. Fill in the form:
   - **Title** (required): The agenda item name
   - **Description** (optional): Additional details
   - **Duration**: Select from 5-60 minutes
   - **Assignee**: Select a board member from the dropdown
3. Click "Save" to add the item

### Editing an Item

1. Hover over an existing agenda item
2. Click the pencil icon that appears
3. Modify the fields as needed
4. Click "Save" to update

### Deleting an Item

1. Hover over an existing agenda item
2. Click the trash icon that appears
3. The item will be removed immediately

## Tech Stack

- **Frontend:** Next.js 14 (Pages Router)
- **Backend:** Convex (real-time database)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Project Structure

```
board-agenda-prototype/
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── agendaItems.ts   # Agenda CRUD operations
│   ├── aiChat.ts        # Boardable AI chat (OpenAI integration)
│   └── users.ts         # User management
├── components/          # React components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Header.tsx       # Top navigation bar
│   ├── Sidebar.tsx      # Left navigation panel
│   ├── MeetingHeader.tsx
│   ├── MaterialsSection.tsx
│   ├── BoardPacketCard.tsx
│   ├── AgendaBuilder.tsx    # Main agenda container
│   ├── AgendaItem.tsx       # Individual item display
│   ├── AgendaItemForm.tsx   # Create/edit form
│   └── BoardableAI.tsx     # Collapsible AI chat panel
├── pages/               # Next.js pages
│   ├── _app.tsx         # App wrapper with Convex provider
│   ├── _document.tsx
│   └── index.tsx        # Main page
└── styles/
    └── globals.css      # Global styles + Tailwind
```

## License

MIT
