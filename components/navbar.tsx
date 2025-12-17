"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="relative w-full bg-white">
      {/* Top blue line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-blue-500" />
      
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
          <Image
            src="/ShareUpdate.png"
            alt="Share Update"
            width={150}
            height={40}
            className="h-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/browse"
            className={cn(
              "transition-colors",
              isActive("/browse")
                ? "text-red-600 font-bold hover:text-red-700"
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            Browse
          </Link>
          <Link
            href="/categories"
            className={cn(
              "transition-colors",
              isActive("/categories")
                ? "text-red-600 font-bold hover:text-red-700"
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            Categories
          </Link>
          <Link
            href="/post-request"
            className={cn(
              "transition-colors",
              isActive("/post-request")
                ? "text-red-600 font-bold hover:text-red-700"
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            Post Request
          </Link>
          <Link
            href="/how-it-works"
            className={cn(
              "transition-colors",
              isActive("/how-it-works")
                ? "text-red-600 font-bold hover:text-red-700"
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            How It Works
          </Link>
        </div>

        {/* Desktop Right side actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-red-600 hover:text-red-700 transition-colors font-medium"
          >
            Sign In
          </Link>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md"
          >
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/browse"
              className={cn(
                "transition-colors py-2",
                isActive("/browse")
                  ? "text-red-600 font-bold hover:text-red-700"
                  : "text-gray-700 hover:text-gray-900"
              )}
              onClick={closeMobileMenu}
            >
              Browse
            </Link>
            <Link
              href="/categories"
              className={cn(
                "transition-colors py-2",
                isActive("/categories")
                  ? "text-red-600 font-bold hover:text-red-700"
                  : "text-gray-700 hover:text-gray-900"
              )}
              onClick={closeMobileMenu}
            >
              Categories
            </Link>
            <Link
              href="/post-request"
              className={cn(
                "transition-colors py-2",
                isActive("/post-request")
                  ? "text-red-600 font-bold hover:text-red-700"
                  : "text-gray-700 hover:text-gray-900"
              )}
              onClick={closeMobileMenu}
            >
              Post Request
            </Link>
            <Link
              href="/how-it-works"
              className={cn(
                "transition-colors py-2",
                isActive("/how-it-works")
                  ? "text-red-600 font-bold hover:text-red-700"
                  : "text-gray-700 hover:text-gray-900"
              )}
              onClick={closeMobileMenu}
            >
              How It Works
            </Link>
            <div className="flex flex-col gap-3 pt-2 border-t border-gray-200">
              <Link
                href="/sign-in"
                className="text-red-600 hover:text-red-700 transition-colors font-medium py-2 text-center"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md w-full"
              >
                <Link href="/get-started" onClick={closeMobileMenu}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

