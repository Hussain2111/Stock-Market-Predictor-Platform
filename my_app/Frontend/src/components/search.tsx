import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// SearchOverlay Component
const SearchOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if focus is in an input field or textarea
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // Only handle Cmd/Ctrl+K if not typing in an input
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !isInputFocused) {
        e.preventDefault(); // Prevent default browser behavior
        setIsOpen(true);
      }

      // Handle Escape key to close (this is fine for any element)
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Focus the search input when overlay opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Store the ticker in localStorage
      localStorage.setItem("currentTicker", searchQuery.trim().toUpperCase());

      // Navigate to analysis page with the ticker
      navigate(`/analysis?ticker=${searchQuery.trim().toUpperCase()}`);

      // Reset the search field and close overlay
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <div>
      {/* Search Icon Button */}
      <button
        onClick={toggleSearch}
        className="p-2 hover:bg-gray-100 hover:bg-opacity-10 rounded-full transition-colors"
        aria-label="Open search"
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 min-h-screen overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          {/* Blur Background */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xl backdrop-saturate-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Content */}
          <div
            className="relative min-h-screen flex flex-col opacity-90 rounded-full border-emerald-200 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Container */}
            <div className="w-full max-w-2xl rounded-full border-emerald-200 mx-auto px-4 pt-32">
              {/* Search Form */}
              <div className="bg-white rounded-full border-emerald-200 shadow-lg mb-4">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search stock ticker... (⌘K)"
                    className="w-full px-4 py-4 pr-12 text-lg border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-900"
                    autoFocus
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchOverlay;
