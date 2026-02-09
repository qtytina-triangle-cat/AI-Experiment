import { Clock, Pencil, Trash2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import AgendaItemForm from "./AgendaItemForm";

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
}

// Generate item label (a., b., c., etc.)
function getItemLabel(index: number): string {
  return String.fromCharCode(97 + index) + ".";
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
}: AgendaItemProps) {
  if (isEditing) {
    return (
      <div className="flex gap-4">
        <div className="w-16 text-right text-sm text-slate-500 pt-2">
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

  return (
    <div className="flex gap-4 group py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors">
      {/* Time Column */}
      <div className="w-16 text-right text-sm text-slate-500 pt-0.5">
        {startTime}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title with label */}
            <h4 className="font-medium text-slate-800">
              <span className="text-slate-500 mr-1">{getItemLabel(index)}</span>
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

            {/* Assignee */}
            {item.assignee && (
              <div className="flex items-center gap-2">
                {item.assignee.avatarUrl ? (
                  <img
                    src={item.assignee.avatarUrl}
                    alt={item.assignee.name}
                    className="w-7 h-7 rounded-full bg-slate-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-user flex items-center justify-center text-white text-xs font-medium">
                    {item.assignee.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm text-slate-600">
                  {item.assignee.name}
                </span>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>{item.duration} minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
