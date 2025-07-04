import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

const HEADER_LINKS = [
  { label: "Home", path: "/" },
  { label: "Predictions", path: "/predictions", hasDropdown: false },
  { label: "Visualize", path: "/visualization", hasDropdown: false },
  { label: "About", path: "/about" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold cursor-pointer">
            <Link to="/">Weather Station</Link>
          </h1>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <ModeToggle />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-3 pt-4">
                  {HEADER_LINKS.map((link) => (
                    <Link
                      key={link.path + link.label}
                      to={link.path}
                      className="hover:text-gray-700 py-2"
                    >
                      {link.label}
                      {link.hasDropdown && (
                        <ChevronDown className="inline-block w-4 h-4" />
                      )}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6 flex-1 justify-center">
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.path + link.label}
                to={link.path}
                className="hover:text-gray-700"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown className="inline-block w-4 h-4" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop mode toggle */}
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
