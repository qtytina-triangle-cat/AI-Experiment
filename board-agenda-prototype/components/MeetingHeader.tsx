import { useState } from "react";
import { MoreVertical, ExternalLink, Link2, Monitor, MapPin, AlignLeft, Calendar } from "lucide-react";
import Avatar from "./Avatar";

interface MeetingHeaderProps {
  defaultExpanded?: boolean;
}

export default function MeetingHeader({ defaultExpanded = false }: MeetingHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="relative z-20">
      {/* Main Header Container - always maintains height in flow */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 relative z-30">
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Left side - Meeting info */}
          <div className="flex items-start gap-4">
            {/* Calendar Icon */}
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex flex-col items-center justify-center text-white shadow-sm shrink-0">
              <span className="text-[10px] font-medium uppercase">SEP</span>
              <span className="text-xl font-bold leading-none">2</span>
            </div>

            {/* Meeting Details */}
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Annual Board Meeting 2023
              </h1>
              <p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-1">
                <span>Friday, September 2nd 2023 | 3:00pm - 5:00pm EDT</span>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1 text-primary-600 hover:text-primary-700 text-sm font-medium focus:outline-none"
                >
                  {isExpanded ? "∧ See less" : "∨ See more"}
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
              Start Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content Overlay */}
      {isExpanded && (
        <>
          {/* Overlay Background - covers the rest of the page */}
          <div 
            className="fixed inset-0 bg-slate-900/20 z-10" 
            onClick={() => setIsExpanded(false)}
            style={{ top: 'auto' }} // Starts below the header naturally if positioned relative, but we need to be careful about stacking contexts.
          />
          
          {/* Expanded Panel */}
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg z-20 px-6 py-6 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl space-y-6">
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Location</h3>
                      <p className="text-sm text-slate-600 mt-0.5">
                        Headquarters - Board Room A<br />
                        123 Business Ave, Suite 100<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link2 className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Meeting Link</h3>
                      <a href="#" className="text-sm text-primary-600 hover:underline mt-0.5 block">
                        https://meet.boardable.com/annual-board-meeting-2023
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <AlignLeft className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Description</h3>
                      <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                        Annual review of company performance, financial statements, and strategic planning for the upcoming fiscal year. All board members are required to attend. Please review the board packet prior to the meeting.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Organizer</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar initials="T" size="md" />
                        <span className="text-sm text-slate-600">Tina Qi (Admin)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
