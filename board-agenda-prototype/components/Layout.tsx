import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  activePage?: string;
}

export default function Layout({ children, activePage }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activePage={activePage} />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
