import { FileText, ExternalLink, Printer } from "lucide-react";

export default function BoardPacketCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-800">Board packet</h3>
            <p className="text-xs text-slate-500">
              generated at 23:55 pm Oct 15th
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
            <ExternalLink className="h-4 w-4" />
            Open PDF
          </button>
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
            <Printer className="h-4 w-4" />
            Quick Print
          </button>
        </div>
      </div>
    </div>
  );
}
