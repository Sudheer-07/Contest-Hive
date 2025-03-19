
import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Contest Hive</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Contests
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
