import { Users, Send } from "lucide-react";
import BoardPacketCard from "./BoardPacketCard";
import AgendaBuilder from "./AgendaBuilder";

export default function MaterialsSection() {
  return (
    <div className="p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Materials</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                A
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                M
              </div>
            </div>
            <span>2 collaborators</span>
          </div>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Send className="h-4 w-4" />
            Republish
          </button>
        </div>
      </div>

      {/* Board Packet Card */}
      <BoardPacketCard />

      {/* Agenda Builder */}
      <AgendaBuilder />
    </div>
  );
}
