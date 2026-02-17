import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Plus,
  ListTodo,
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  status?: string;
  active?: boolean;
  hasSubItems?: boolean;
  subItems?: { label: string; active?: boolean }[];
  href?: string;
}

function NavItem({
  icon,
  label,
  status,
  active,
  hasSubItems,
  subItems,
  href,
}: NavItemProps) {
  const content = (
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
  );

  return (
    <div>
      {href ? <Link href={href}>{content}</Link> : content}
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

interface SidebarProps {
  activePage?: string;
  isCollapsed?: boolean;
}

export default function Sidebar({ activePage = "agenda", isCollapsed = false }: SidebarProps) {
  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
        isCollapsed ? "w-0 border-r-0" : "w-56"
      }`}
    >
      <nav className="flex-1 pt-0 pb-4 min-w-[14rem]">
        <NavItem
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Invitees"
          status="Invites sent · Tracking RSVP"
          active={activePage === "invitees"}
          href="/invitees"
        />
        <NavItem
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Materials"
          active={activePage === "materials" || activePage === "agenda"}
          hasSubItems={true}
          subItems={[
            { label: "Board packet" },
            { label: "Agenda", active: activePage === "agenda" },
            { label: "Supporting documents" },
          ]}
          href="/"
        />
        <NavItem
          icon={<Circle className="h-5 w-5" />}
          label="Recording"
          status="Not started"
          active={activePage === "recording"}
          href="/recording"
        />
        <NavItem
          icon={<Circle className="h-5 w-5" />}
          label="Minutes"
          status="Not started"
          active={activePage === "minutes"}
          href="/minutes"
        />
        <NavItem
          icon={
            <div className="h-5 w-5 border-[1.5px] border-dashed border-slate-400 rounded-full flex items-center justify-center">
              <Plus className="h-3 w-3 text-slate-400" />
            </div>
          }
          label="Public page"
          status="Secondary"
          active={activePage === "public"}
        />
        <NavItem
          icon={
            <div className="h-5 w-5 border-[1.5px] border-dashed border-slate-400 rounded-full flex items-center justify-center">
              <Plus className="h-3 w-3 text-slate-400" />
            </div>
          }
          label="Tasks & polls"
          status="Secondary"
          active={activePage === "tasks"}
        />
      </nav>
    </aside>
  );
}
