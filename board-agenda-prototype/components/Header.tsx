import { Search, Video, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-2 w-48 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Video className="h-5 w-5 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="h-5 w-5 text-slate-500" />
        </button>
        {/* User Avatar */}
        <button className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
          T
        </button>
      </div>
    </header>
  );
}
