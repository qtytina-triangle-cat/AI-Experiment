import { MoreVertical, ExternalLink, Link2, Monitor } from "lucide-react";

export default function MeetingHeader() {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-start justify-between">
        {/* Left side - Meeting info */}
        <div className="flex items-start gap-4">
          {/* Calendar Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex flex-col items-center justify-center text-white shadow-sm">
            <span className="text-[10px] font-medium uppercase">SEP</span>
            <span className="text-xl font-bold leading-none">2</span>
          </div>

          {/* Meeting Details */}
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Annual Board Meeting 2023
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Friday, September 2nd 2023 | 3:00pm - 5:00pm EDT{" "}
              <span className="mx-2">•</span>
              <span className="text-slate-700">Boardable meeting</span>
              <button className="ml-2 text-primary-600 hover:text-primary-700 text-sm">
                ∨ See more
              </button>
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5 text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ExternalLink className="h-5 w-5 text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Link2 className="h-5 w-5 text-slate-500" />
          </button>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Monitor className="h-4 w-4" />
            Meeting starts in 3 weeks
          </button>
        </div>
      </div>
    </div>
  );
}
