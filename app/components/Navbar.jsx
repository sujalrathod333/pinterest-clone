"use client";

import { Menu, Search, X, Plus, Home, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef(null);

  /* ==========================
     SEARCH
  ========================== */
  const handleSearch = () => {
    const trimmed = query.trim();

    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }

    setIsMenuOpen(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* ==========================
     CLOSE PROFILE ON OUTSIDE
  ========================== */
  useEffect(() => {
    const closeMenu = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  /* ==========================
     ACTIVE LINK STYLE
  ========================== */
  const navLink = (path) =>
    `px-4 py-2 rounded-full font-medium transition ${
      pathname === path ? "bg-black text-white" : "text-black hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[74px] flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/">
            <div className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
              <Image
                src="/pinterest.svg"
                alt="Pinterest"
                width={32}
                height={32}
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={navLink("/")}>
              Home
            </Link>

            <Link href="/upload-pin" className={navLink("/upload-pin")}>
              Create
            </Link>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden sm:flex flex-1 max-w-3xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for ideas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEnter}
              className="w-full bg-gray-100 rounded-full py-3 pl-5 pr-14 outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />

            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Profile */}
          {session?.user?.image && (
            <div ref={profileRef} className="relative">
              <Image
                src={session.user.image}
                alt="user"
                width={42}
                height={42}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="rounded-full cursor-pointer object-cover border-2 border-transparent hover:border-red-500 transition"
                priority
              />

              {/* Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-xl border p-3">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <Image
                      src={session.user.image}
                      alt="user"
                      width={45}
                      height={45}
                      className="rounded-full"
                    />

                    <div>
                      <p className="font-semibold text-sm">
                        {session.user.name}
                      </p>

                      <p className="text-xs text-gray-500">Logged in</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      signOut({
                        callbackUrl: "/signIn",
                      })
                    }
                    className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-500 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen
            ? "max-h-[400px] opacity-100 border-t"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-4 bg-white">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search ideas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEnter}
              className="w-full bg-gray-100 rounded-full py-3 px-5 pr-14 outline-none"
            />

            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Links */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 py-2 font-medium"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            href="/upload-pin"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 py-2 font-medium"
          >
            <Plus size={18} />
            Create Pin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
