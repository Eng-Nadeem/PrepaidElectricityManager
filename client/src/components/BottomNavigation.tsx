import { Link, useLocation } from "wouter";
import { HomeIcon, HistoryIcon, UserIcon, SettingsIcon } from "lucide-react";

const BottomNavigation = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 px-4 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/history">
          <a className={`flex flex-col items-center py-2 px-4 ${isActive('/history') ? 'text-primary' : 'text-gray-500'}`}>
            <HistoryIcon className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center py-2 px-4 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
            <UserIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={`flex flex-col items-center py-2 px-4 ${isActive('/settings') ? 'text-primary' : 'text-gray-500'}`}>
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
