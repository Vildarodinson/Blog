import Link from "next/link";
import React from "react";

const navLinks = [
  { name: "Discover", href: "/discover" },
  { name: "New Blog", href: "/blog/new" },
  { name: "About", href: "/about" },
];

export const Navbar = () => {
  return (
    <nav className="bg-gray-400 p-4">
      <div className="container mx-auto flex justify-between px-10">
        <Link href="/" className="text-white text-xl font-bold">
          Home
        </Link>
        <div className="flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-white">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
