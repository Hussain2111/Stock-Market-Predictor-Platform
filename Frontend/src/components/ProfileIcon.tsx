import { useState, useRef, useEffect } from 'react';
import { Settings, History, LogOut, Bookmark, LineChart, Wallet, Star, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import defaultAvatar from '../Settings/defaultpic.jpg';
import { authService } from '../authService';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  analysesRemaining: number;
}

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User',
    email: '',
    avatar: defaultAvatar,
    analysesRemaining: 3
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data here
    fetchUserData();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch user data function
  const fetchUserData = async () => {
    // Get user email from localStorage
    const userEmail = authService.getUserEmail();
    
    if (userEmail) {
      // Extract username from email (everything before @)
      const atIndex = userEmail.indexOf('@');
      let username = userEmail;
      if (atIndex !== -1) {
        username = userEmail.substring(0, atIndex);
        username = username.charAt(0).toUpperCase() + username.slice(1);
      }
      
      setUserProfile({
        name: username,
        email: userEmail,
        avatar: defaultAvatar,
        analysesRemaining: 3
      });
    } else {
      // If no user is logged in, use defaults
      setUserProfile({
        name: 'Guest',
        email: '',
        avatar: defaultAvatar,
        analysesRemaining: 3
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('fullName');
    // Redirect to login page or home page
    window.location.href = '/';
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-gray-800 p-1 hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-white">{userProfile.name}</p>
                <p className="text-sm text-gray-400">{userProfile.email}</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-1 p-2 border-b border-gray-800">
            <button
              onClick={() => handleNavigation('/analysis')}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <LineChart className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-xs text-gray-300">Analysis</span>
            </button>
            <button
              onClick={() => handleNavigation('/watchlist')}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <Star className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-xs text-gray-300">Watchlist</span>
            </button>
            <button
              onClick={() => handleNavigation('/portfolio')}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <Wallet className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-xs text-gray-300">Portfolio</span>
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <button 
              onClick={() => handleNavigation('/settings')}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors w-full text-left"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors w-full text-left"
            >
              <History className="w-5 h-5 text-gray-400" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavigation('/portfolio')}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors w-full text-left"
            >
              <Bookmark className="w-5 h-5 text-gray-400" />
              <span>Portfolio</span>
            </button>
            <button 
              onClick={() => handleNavigation('/trade')}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors w-full text-left"
            >
              <List className="w-5 h-5 text-gray-400" />
              <span>Trade</span>
            </button>
            <div className="border-t border-gray-800 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5 text-gray-400" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;