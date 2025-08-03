import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";

interface ProfileDropdownProps {
  user: {
    avatar: string;
    name: string;
  };
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const logoutMe = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Redirect to login
    window.location.href = "/auth/login";
  };

  return (
    <div className="z-50" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <div className="relative w-10 h-10 border border-primary-500 rounded-full overflow-hidden">
          <Image
            src={user?.avatar || ""}
            alt="Profile Image"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
        <span className="font-medium">{user?.name}</span>
        <ChevronDown className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-20 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-4">
            <Link
              href="/admin/profile"
              className="w-full inline-flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-gray-100 "
              onClick={() => setIsOpen(false)}
            >
              <User /> Profile
            </Link>
            <Link
              href="/admin/settings"
              className="w-full inline-flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings /> Settings
            </Link>
            <button
              className="w-full inline-flex items-center gap-4 text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false);
                logoutMe();
                console.log("Logout");
              }}
            >
              <LogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
