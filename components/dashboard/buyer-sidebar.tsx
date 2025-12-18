"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  FileText,
  Heart,
  Wallet,
  RefreshCw,
  Star,
  AlertCircle,
  Search,
  PlusCircle,
  CreditCard,
  X,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { label: "Overview", href: "/buyer", icon: Home },
  { label: "Messages", href: "/buyer/messages", icon: MessageSquare, badge: 3 },
  { label: "My Purchases", href: "/buyer/purchases", icon: ShoppingBag, badge: 5 },
  { label: "My Requests", href: "/buyer/requests", icon: FileText, badge: 2 },
  { label: "Wishlist", href: "/buyer/wishlist", icon: Heart, badge: 3 },
  { label: "Wallet", href: "/buyer/wallet", icon: Wallet },
  { label: "Active Trades", href: "/buyer/trades", icon: RefreshCw, badge: 1 },
  { label: "Reviews", href: "/buyer/reviews", icon: Star },
  { label: "Disputes", href: "/buyer/disputes", icon: AlertCircle },
];

const quickActions = [
  { label: "Browse Products", href: "/browse", icon: Search },
  { label: "Post Request", href: "/buyer/post-request", icon: PlusCircle },
  { label: "Add Funds", href: "/buyer/wallet/add", icon: CreditCard },
];

export function BuyerSidebar({ isOpen, onClose }: BuyerSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/buyer") {
      return pathname === "/buyer";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/ShareUpdate.png"
              alt="Share Update"
              width={140}
              height={35}
              className="h-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dashboard Label */}
        <div className="px-4 py-3">
          <span className="text-sm font-medium text-gray-500">Buyer Dashboard</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <IconComponent className={cn("h-5 w-5", active ? "text-red-600" : "text-gray-500")} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Actions
            </span>
            <ul className="mt-3 space-y-1">
              {quickActions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <IconComponent className="h-5 w-5 text-gray-500" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
              <Image
                src="/placeholder-image.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Michael Chen</p>
              <p className="text-xs text-gray-500">Verified Buyer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

