import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckCircle2, Printer, MoreVertical, Plus } from "lucide-react";
import AgendaItem from "./AgendaItem";
import AgendaItemForm from "./AgendaItemForm";

// Meeting start time for calculating agenda item times
const MEETING_START_HOUR = 15; // 3:00 PM
const MEETING_START_MINUTE = 0;

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hour12 = hours % 12 || 12;
  const period = hours < 12 ? "am" : "pm";
  return `${hour12}:${mins.toString().padStart(2, "0")}${period}`;
}

function calculateStartTime(items: { duration: number }[], index: number): string {
  let totalMinutes = MEETING_START_HOUR * 60 + MEETING_START_MINUTE;
  for (let i = 0; i < index; i++) {
    totalMinutes += items[i].duration;
  }
  return formatTime(totalMinutes);
}

export default function AgendaBuilder() {
  const agendaItems = useQuery(api.agendaItems.get);
  const users = useQuery(api.users.list);
  const seedUsers = useMutation(api.users.seed);
  const seedStarter = useMutation(api.agendaItems.seedStarter);
  const createItem = useMutation(api.agendaItems.create);
  const updateItem = useMutation(api.agendaItems.update);
  const deleteItem = useMutation(api.agendaItems.remove);
  const reorderItem = useMutation(api.agendaItems.reorder);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<Id<"agendaItems"> | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<Id<"agendaItems"> | null>(null);
  const hasSeededStarter = useRef(false);
  
  // Optimistic UI state
  const [optimisticItems, setOptimisticItems] = useState<typeof agendaItems>(undefined);

  // Sync optimistic state with server state
  useEffect(() => {
    if (agendaItems) {
      setOptimisticItems(agendaItems);
    }
  }, [agendaItems]);

  // Seed 3 starter agenda items when beginning state (empty agenda)
  useEffect(() => {
    if (
      agendaItems !== undefined &&
      agendaItems.length === 0 &&
      !hasSeededStarter.current
    ) {
      hasSeededStarter.current = true;
      seedStarter().catch(() => {});
    }
  }, [agendaItems, seedStarter]);

  // Seed users on first load if needed
  const handleSeedUsers = async () => {
    await seedUsers();
  };

  const handleAddItem = async (data: {
    title: string;
    description?: string;
    duration: number;
    assigneeId?: Id<"users">;
  }) => {
    await createItem(data);
    setIsAddingItem(false);
  };

  const handleUpdateItem = async (
    id: Id<"agendaItems">,
    data: {
      title?: string;
      description?: string;
      duration?: number;
      assigneeId?: Id<"users">;
    }
  ) => {
    await updateItem({ id, ...data });
    setEditingItemId(null);
  };

  const handleDeleteItem = async (id: Id<"agendaItems">) => {
    await deleteItem({ id });
  };

  const handleEditItem = (id: Id<"agendaItems">) => {
    setEditingItemId(id);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleCancelAdd = () => {
    setIsAddingItem(false);
  };

  const handleDragStart = (itemId: Id<"agendaItems">) => (e: React.DragEvent) => {
    setDraggingItemId(itemId);
    e.dataTransfer.setData("application/x-agenda-item-id", itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (targetIndex: number) => async (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("application/x-agenda-item-id") as Id<"agendaItems">;
    if (!itemId || !optimisticItems) return;
    
    setDraggingItemId(null);
    const currentIndex = optimisticItems.findIndex((i) => i._id === itemId);
    if (currentIndex === -1 || currentIndex === targetIndex) return;

    // Optimistic update
    const newItems = [...optimisticItems];
    const [movedItem] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);
    setOptimisticItems(newItems);

    await reorderItem({ itemId, newOrder: targetIndex });
  };

  const handleDragEnd = () => {
    setDraggingItemId(null);
  };

  // Loading state
  if (optimisticItems === undefined) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-24 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-slate-100 rounded"></div>
            <div className="h-16 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Agenda Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-800">Agenda</h3>
          {optimisticItems.length > 0 && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Printer className="h-5 w-5 text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Agenda Items */}
      <div className="p-6 agenda-scroll max-h-[600px] overflow-y-auto">
        {optimisticItems.length === 0 && !isAddingItem ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-slate-600 mb-2">
              No agenda items yet
            </h4>
            <p className="text-sm text-slate-500 mb-6">
              Start building your meeting agenda by adding items below.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {optimisticItems.map((item, index) => (
              <AgendaItem
                key={item._id}
                item={item}
                index={index}
                startTime={calculateStartTime(optimisticItems, index)}
                isEditing={editingItemId === item._id}
                users={users || []}
                onEdit={() => handleEditItem(item._id)}
                onSave={(data) => handleUpdateItem(item._id, data)}
                onDelete={() => handleDeleteItem(item._id)}
                onCancel={handleCancelEdit}
                onSeed={handleSeedUsers}
                onDragStart={handleDragStart(item._id)}
                onDragOver={handleDragOver}
                onDrop={handleDrop(index)}
                onDragEnd={handleDragEnd}
                isDragging={draggingItemId === item._id}
              />
            ))}
          </div>
        )}

        {/* Add Item Form */}
        {isAddingItem && (
          <div className="mt-4 flex gap-4">
            <div className="w-16 text-right text-sm text-slate-500 pt-2">
              {calculateStartTime(optimisticItems, optimisticItems.length)}
            </div>
            <div className="flex-1">
              <AgendaItemForm
                users={users || []}
                onSave={handleAddItem}
                onCancel={handleCancelAdd}
                onSeed={handleSeedUsers}
              />
            </div>
          </div>
        )}

        {/* Add Item Button */}
        {!isAddingItem && (
          <button
            onClick={() => setIsAddingItem(true)}
            className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add item
          </button>
        )}
      </div>
    </div>
  );
}
