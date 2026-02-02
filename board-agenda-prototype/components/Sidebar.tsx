import {
  CheckCircle2,
  Circle,
  Sparkles,
  ListTodo,
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  status?: string;
  active?: boolean;
  hasSubItems?: boolean;
  subItems?: { label: string; active?: boolean }[];
}

function NavItem({
  icon,
  label,
  status,
  active,
  hasSubItems,
  subItems,
}: NavItemProps) {
  return (
    <div>
      <div
        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
          active
            ? "bg-primary-50 border-l-2 border-primary-600"
            : "hover:bg-slate-50 border-l-2 border-transparent"
        }`}
      >
        <div className={active ? "text-primary-600" : "text-slate-400"}>
          {icon}
        </div>
        <div className="flex-1">
          <div
            className={`text-sm font-medium ${
              active ? "text-primary-600" : "text-slate-700"
            }`}
          >
            {label}
          </div>
          {status && (
            <div className="text-xs text-slate-500 mt-0.5">{status}</div>
          )}
        </div>
      </div>
      {hasSubItems && subItems && (
        <div className="ml-11 pb-2">
          {subItems.map((item, index) => (
            <div
              key={index}
              className={`text-sm py-1.5 cursor-pointer ${
                item.active
                  ? "text-primary-600 font-medium"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              • {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
      <nav className="flex-1 py-4">
        <NavItem
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Invitees"
          status="Invites sent · Tracking RSVP"
        />
        <NavItem
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Materials"
          active={true}
          hasSubItems={true}
          subItems={[
            { label: "Board packet" },
            { label: "Agenda", active: true },
            { label: "Supporting documents" },
          ]}
        />
        <NavItem
          icon={<Circle className="h-5 w-5" />}
          label="Recording"
          status="Not started"
        />
        <NavItem
          icon={<Circle className="h-5 w-5" />}
          label="Minutes"
          status="Not started"
        />
        <NavItem
          icon={<Sparkles className="h-5 w-5" />}
          label="Public page"
          status="Optional"
        />
        <NavItem
          icon={<Sparkles className="h-5 w-5" />}
          label="Tasks & polls"
          status="Optional"
        />
      </nav>
    </aside>
  );
}
