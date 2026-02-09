import { Mail } from "lucide-react";
import Avatar from "./Avatar";

interface SecondaryHeaderProps {
  title: string;
  collaboratorsCount?: number;
  collaborators?: {
    initials: string;
    variant: 'teal' | 'blue' | 'purple';
  }[];
  actionLabel?: string;
  onAction?: () => void;
}

export default function SecondaryHeader({
  title,
  collaboratorsCount = 0,
  collaborators = [],
  actionLabel = "Publish",
  onAction
}: SecondaryHeaderProps) {
  return (
    <div className="flex items-center justify-between py-0 mb-6">
      {/* Title */}
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Collaborators */}
        {(collaborators.length > 0 || collaboratorsCount > 0) && (
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {collaborators.map((collab, index) => (
                <Avatar 
                  key={index} 
                  initials={collab.initials} 
                  variant={collab.variant} 
                  size="sm"
                  className="ring-2 ring-white z-10"
                />
              ))}
            </div>
            {collaboratorsCount > 0 && (
              <span className="text-sm text-slate-500">
                {collaboratorsCount} collaborators
              </span>
            )}
          </div>
        )}

        {/* Primary Button */}
        <button 
          onClick={onAction}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Mail className="w-4 h-4" />
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
