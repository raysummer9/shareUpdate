"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  marketplace: [
    { label: "Browse Products", href: "/browse/products" },
    { label: "Browse Services", href: "/browse/services" },
    { label: "Post Request", href: "/post-request" },
    { label: "Seller Dashboard", href: "/seller/dashboard" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Dispute Resolution", href: "/disputes" },
    { label: "Safety Tips", href: "/safety-tips" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Fee Structure", href: "/fees" },
    { label: "Escrow Policy", href: "/escrow-policy" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/shareupdate", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/shareupdate", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/shareupdate", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/shareupdate", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: '#1A1D29' }}>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2 mb-6 md:mb-0">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo-footer.png"
                alt="Share Update"
                width={300}
                height={60}
                className="h-auto w-[250px] sm:w-[280px] lg:w-[300px]"
              />
            </Link>
            <p className="text-gray-400 text-sm md:text-base max-w-md">
              The leading and most trusted marketplace for digital products and services.
            </p>
          </div>

          {/* Marketplace Column */}
          <div className="col-span-1 mb-4 md:mb-0">
            <h3 className="text-white font-bold text-base md:text-lg mb-4 sm:mb-6">Marketplace</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm md:text-base block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-span-1 mb-4 md:mb-0">
            <h3 className="text-white font-bold text-base md:text-lg mb-4 sm:mb-6">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm md:text-base block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 mb-4 md:mb-0">
            <h3 className="text-white font-bold text-base md:text-lg mb-4 sm:mb-6">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm md:text-base block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Copyright */}
            <p className="text-gray-400 text-xs sm:text-sm md:text-base text-center sm:text-left">
              © 2025 Share Update. All rights reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

