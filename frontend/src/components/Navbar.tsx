import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { LogOut, Layers, User } from "lucide-react";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const { userId, username, logout, isAuthenticated } = useAuth();
  const [displayName, setDisplayName] = useState(username);
  const navigate = useNavigate();

  useEffect(() => {
    setDisplayName(username);
  }, [username]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!isAuthenticated || username) return;
      try {
        const response = await api.get("/me/");
        if (response.data?.username) {
          localStorage.setItem("username", response.data.username);
          setDisplayName(response.data.username);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated, username]);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link to="/dashboard" className="flex items-center gap-2 text-white font-bold text-lg tracking-wider hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-4.5 h-4.5 text-white" />
          </div>
          <span>Task<span className="text-indigo-400">Flow</span></span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              Dashboard
            </Link>
            
            <div className="h-4 w-px bg-zinc-800"></div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{displayName || `User #${userId}`}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/50 text-zinc-300 hover:text-red-400 text-xs font-medium transition-all"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
