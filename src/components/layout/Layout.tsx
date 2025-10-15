import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isProblemPage = location.pathname.startsWith('/problem/');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className={`flex-1 ${isProblemPage ? '' : 'container mx-auto px-4 py-8'}`}>
        {children}
      </main>
      {!isProblemPage && <Footer />}
    </div>
  );
}

export default Layout;

