"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, Menu, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, signOut } = useAuth();
  const router = useRouter();

  // Get user info from profile
  const displayName = profile?.full_name || profile?.username || "User";
  const avatarUrl = profile?.avatar_url || "/placeholder-image.png";
  const userRole = profile?.role || "buyer";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, services..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">{displayName}</span>
              <ChevronDown className={`h-4 w-4 text-gray-500 hidden sm:block transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                
                <Link
                  href={`/${userRole}`}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  Dashboard
                </Link>
                
                <Link
                  href={`/${userRole}/settings`}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                  Settings
                </Link>
                
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

