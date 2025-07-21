"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className='bg-gray-900 shadow-xl shadow-white text-white flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-2 md:h-16'>
      {/* Logo */}
      <Link href="/" className="logo font-bold text-2xl flex items-center gap-2 mb-2 sm:mb-0">
        <img className="rounded-b-xl" src="/tea1.gif" width={44} alt="Chai Logo" />
        <span>Get Me a Chai</span>
      </Link>

      {/* Right Section */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        {session && (
          <>
            {/* Dropdown Button */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 1000)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center w-full sm:w-auto"
            >
              Welcome: {session.user.email}
              <svg
                className="w-2.5 h-2.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`z-10 ${
                showDropdown ? "" : "hidden"
              } absolute right-0 top-full mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}
            >
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div className="font-medium truncate">{session.user.email}</div>
              </div>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  {status === "loading" ? (
                    <span className="px-4 py-2">Loading...</span>
                  ) : session?.user?.username && (
                    <Link
                      href={`/${session.user.username}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Your Page
                    </Link>
                  )}
                </li>
              </ul>
              <div className="py-2">
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}

        {/* Logout */}
        {session && (
          <button
            type="button"
            onClick={() => signOut()}
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 w-full sm:w-auto"
          >
            Logout
          </button>
        )}

        {/* Login */}
        {!session && (
          <Link href="/Login" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
