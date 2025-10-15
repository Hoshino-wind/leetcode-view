import { Link } from "react-router-dom";
import { Code2, Github } from "lucide-react";

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition">
            <Code2 size={32} />
            <span>LeetCode 可视化</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition font-medium">
              题目列表
            </Link>
            <a 
              href="https://github.com/Hoshino-wind/leetcode-view" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
            >
              <Github size={20} />
              <span className="font-medium">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

