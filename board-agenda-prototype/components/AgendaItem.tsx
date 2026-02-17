import { Clock, Pencil, Trash2, GripVertical } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import AgendaItemForm from "./AgendaItemForm";
import Avatar, { getAvatarVariantForUser } from "./Avatar";

interface User {
  _id: Id<"users">;
  name: string;
  avatarUrl?: string;
  role?: string;
}

interface AgendaItemData {
  _id: Id<"agendaItems">;
  title: string;
  description?: string;
  duration: number;
  assigneeId?: Id<"users">;
  assignee?: User | null;
  order: number;
}

interface AgendaItemProps {
  item: AgendaItemData;
  index: number;
  startTime: string;
  isEditing: boolean;
  users: User[];
  onEdit: () => void;
  onSave: (data: {
    title?: string;
    description?: string;
    duration?: number;
    assigneeId?: Id<"users">;
  }) => void;
  onDelete: () => void;
  onCancel: () => void;
  onSeed?: () => void;
  /** Drag handle - only used when not editing */
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

// Generate item label (a., b., c., etc.)
function getItemLabel(index: number): string {
  // return String.fromCharCode(97 + index) + ".";
  return "";
}

export default function AgendaItem({
  item,
  index,
  startTime,
  isEditing,
  users,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  onSeed,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}: AgendaItemProps) {
  if (isEditing) {
    return (
      <div
        className="flex gap-4"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="w-6 shrink-0" aria-hidden />
        <div className="w-16 text-right text-sm text-slate-500 pt-2 shrink-0">
          {startTime}
        </div>
        <div className="flex-1">
          <AgendaItemForm
            initialData={{
              title: item.title,
              description: item.description,
              duration: item.duration,
              assigneeId: item.assigneeId,
            }}
            users={users}
            onSave={onSave}
            onCancel={onCancel}
            onSeed={onSeed}
          />
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent) => {
    const row = e.currentTarget.closest("[data-agenda-item-row]");
    if (row instanceof HTMLElement) {
      const rect = row.getBoundingClientRect();
      e.dataTransfer.setDragImage(row, e.clientX - rect.left, e.clientY - rect.top);
    }
    onDragStart?.(e);
  };

  return (
    <div
      data-agenda-item-row
      className={`flex items-start gap-4 group py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors ${isDragging ? "opacity-50" : ""}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Grab handle - aligned to top, slate-300 per style guide */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        className="flex items-start w-6 -ml-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none shrink-0 pt-0.5"
        title="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      {/* Time Column */}
      <div className="w-16 text-right text-sm text-slate-500 pt-0.5 shrink-0">
        {startTime}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title with label */}
            <h4 className="font-medium text-slate-800">
              {/* <span className="text-slate-500 mr-1">{getItemLabel(index)}</span> */}
              {item.title}
            </h4>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {/* Right side: Assignee & Duration */}
          <div className="flex items-center gap-4 ml-4">
            {/* Edit/Delete buttons (show on hover) */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                title="Edit item"
              >
                <Pencil className="h-4 w-4 text-slate-500" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-red-100 rounded transition-colors"
                title="Delete item"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>

            {/* Assignee - fixed width for vertical alignment */}
            <div className="flex items-center gap-2 w-[124px] min-w-[124px] shrink-0">
              {item.assignee ? (
                <>
                  <Avatar 
                    initials={item.assignee.name.charAt(0)} 
                    size="sm"
                    variant={getAvatarVariantForUser(item.assignee._id)}
                    alt={item.assignee.name}
                    className="w-7 h-7 shrink-0"
                  />
                  <span className="text-sm text-slate-600 truncate min-w-0" title={item.assignee.name}>
                    {item.assignee.name}
                  </span>
                </>
              ) : null}
            </div>

            {/* Duration - fixed width for vertical alignment */}
            <div className="flex items-center gap-1 text-sm text-slate-500 w-[90px] min-w-[90px] shrink-0">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.duration} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
