import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ChevronDown, User } from "lucide-react";
import Avatar, { getAvatarVariantForUser } from "./Avatar";

interface User {
  _id: Id<"users">;
  name: string;
  avatarUrl?: string;
  role?: string;
}

interface FormData {
  title: string;
  description?: string;
  duration: number;
  assigneeId?: Id<"users">;
}

interface AgendaItemFormProps {
  initialData?: FormData;
  users: User[];
  onSave: (data: FormData) => void;
  onCancel: () => void;
  onSeed?: () => void;
}

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export default function AgendaItemForm({
  initialData,
  users,
  onSave,
  onCancel,
  onSeed,
}: AgendaItemFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [duration, setDuration] = useState(initialData?.duration || 10);
  const [assigneeId, setAssigneeId] = useState<Id<"users"> | undefined>(
    initialData?.assigneeId
  );
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const selectedAssignee = users.find((u) => u._id === assigneeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    setErrors({});
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      duration,
      assigneeId,
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 bg-primary-50 p-4 rounded-lg border-2 border-primary-100 shadow-sm"
    >
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Agenda Item Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Call to Order"
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.title ? "border-red-300" : "border-slate-200"
          }`}
          autoFocus
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description Textarea */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a brief description of this agenda item..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Duration and Assignee Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Duration */}
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Duration
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {DURATION_OPTIONS.map((mins) => (
              <option key={mins} value={mins}>
                {mins} minutes
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Assignee
          </label>
          <button
            type="button"
            onClick={() => {
              const willOpen = !isAssigneeDropdownOpen;
              setIsAssigneeDropdownOpen(willOpen);
              if (willOpen && users.length === 0 && onSeed) {
                onSeed();
              }
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-left flex items-center justify-between bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {selectedAssignee ? (
              <div className="flex items-center gap-2">
                <Avatar 
                  initials={selectedAssignee.name.charAt(0)}
                  size="sm"
                  variant={getAvatarVariantForUser(selectedAssignee._id)}
                  alt={selectedAssignee.name}
                  className="w-5 h-5 text-[10px]"
                />
                <span>{selectedAssignee.name}</span>
              </div>
            ) : (
              <span className="text-slate-500">Select assignee</span>
            )}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isAssigneeDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {/* No assignee option */}
              <button
                type="button"
                onClick={() => {
                  setAssigneeId(undefined);
                  setIsAssigneeDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="h-5 w-5 text-slate-400" />
                <span className="text-slate-500">No assignee</span>
              </button>
              {users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => {
                    setAssigneeId(user._id);
                    setIsAssigneeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 ${
                    assigneeId === user._id ? "bg-primary-50" : ""
                  }`}
                >
                  <Avatar 
                    initials={user.name.charAt(0)}
                    size="sm"
                    variant={getAvatarVariantForUser(user._id)}
                    alt={user.name}
                    className="w-6 h-6 text-xs"
                  />
                  <div>
                    <span className="font-medium text-slate-800">
                      {user.name}
                    </span>
                    {user.role && (
                      <span className="text-slate-500 ml-2 text-xs">
                        {user.role}
                      </span>
                    )}
                  </div>
                </button>
              ))}
              {users.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-slate-500">
                  No users available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
