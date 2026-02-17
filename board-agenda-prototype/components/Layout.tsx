import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import BoardableAI from "./BoardableAI";

interface LayoutProps {
  children: ReactNode;
  activePage?: string;
}

export default function Layout({ children, activePage }: LayoutProps) {
  const [isAIExpanded, setIsAIExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div 
        className="flex flex-1 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ marginRight: isAIExpanded ? '384px' : '0' }}
      >
        <Sidebar activePage={activePage} isCollapsed={isAIExpanded} />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ marginRight: isAIExpanded ? '384px' : '0' }}
      >
        <Footer />
      </div>
      <BoardableAI isExpanded={isAIExpanded} onToggle={setIsAIExpanded} />
    </div>
  );
}
