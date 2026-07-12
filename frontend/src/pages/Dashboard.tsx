import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  Briefcase,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface Team {
  id: number;
  team_name: string;
  team_description: string;
  created_at: string;
  created_by: number;
  created_by_username?: string;
}

interface Stats {
  total_tasks: number;
  In_progress: number;
  Completed: number;
  review_tasks: number;
  todo_tasks: number;
  high_priority_tasks: number;
  over_due_tasks: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [teamsError, setTeamsError] = useState(false);

  // Fallback state
  const [fallbackId, setFallbackId] = useState("");

  // Create Team modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);

  const fetchTeams = async () => {
    setLoadingTeams(true);
    setTeamsError(false);
    try {
      const response = await api.get("/get-teams/");
      if (response.data.status) {
        setTeams(response.data.data);
      } else {
        setTeamsError(true);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setTeamsError(true);
    } finally {
      setLoadingTeams(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await api.get("/statistics/");
      // Response is a raw object, e.g. { total_tasks: 0, In_progress: 0 ... }
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch global stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchStats();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    setCreatingTeam(true);
    try {
      const response = await api.post("/create-team/", {
        team_name: newTeamName,
        team_description: newTeamDesc,
      });

      if (response.data.status) {
        toast.success("Team created successfully!");
        const newTeamId = response.data.team_id;
        
        // Refetch and redirect
        await fetchTeams();
        setShowCreateModal(false);
        setNewTeamName("");
        setNewTeamDesc("");
        
        navigate(`/team/${newTeamId}`);
      } else {
        toast.error(response.data.message || "Failed to create team");
      }
    } catch (error: any) {
      console.error("Create team error:", error);
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackId.trim() || isNaN(Number(fallbackId))) {
      toast.error("Please enter a valid numeric Team ID");
      return;
    }
    navigate(`/team/${fallbackId}`);
  };

  return (
    <div className="flex-1 bg-[#0b0f19] text-zinc-100 p-6 md:p-10 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Workspace Dashboard
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Open a team workspace to create, edit, and track tasks.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Global Task Statistics
          </h2>
          {loadingStats ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-zinc-900/40 border border-zinc-850 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 hover:border-zinc-800 transition-all">
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Tasks</p>
                <p className="text-3xl font-black mt-2 text-white">{stats.total_tasks}</p>
              </div>
              {/* Card 2: In Progress */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 hover:border-zinc-800 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">In Progress</p>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/30 animate-pulse"></span>
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats.In_progress}</p>
              </div>
              {/* Card 3: Completed */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 hover:border-zinc-800 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Completed</p>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats.Completed}</p>
              </div>
              {/* Card 4: Overdue */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 hover:border-zinc-800 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider text-rose-400">Overdue</p>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-3xl font-black mt-2 text-rose-400">{stats.over_due_tasks}</p>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">Failed to load statistics.</p>
          )}
        </div>

        {/* Main Content Grid: Teams & Backup ID Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Teams Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              My Teams
            </h2>

            {loadingTeams ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-32 bg-zinc-900/40 border border-zinc-850 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : teamsError ? (
              <div className="p-6 bg-red-950/20 border border-red-900/50 rounded-2xl text-center">
                <p className="text-red-400 text-sm font-semibold">Could not load teams from server.</p>
                <p className="text-zinc-400 text-xs mt-1">Please use the "Open Team by ID" manual form on the side to connect to your team.</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="p-8 bg-zinc-900/20 border border-zinc-800/80 border-dashed rounded-2xl text-center">
                <FolderOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 text-sm font-medium">You aren't associated with any teams yet.</p>
                <p className="text-zinc-500 text-xs mt-1">Click "Create Team" or enter an ID manually to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => navigate(`/team/${team.id}`)}
                    className="group relative bg-zinc-950/40 border border-zinc-850 hover:border-indigo-500/60 rounded-2xl p-5 cursor-pointer shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                        {team.team_name}
                      </h3>
                      <ArrowUpRight className="w-4.5 h-4.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-zinc-400 text-xs mt-1.5 line-clamp-2 min-h-[2rem]">
                      {team.team_description || "No description provided."}
                    </p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/team/${team.id}`);
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Manage Tasks</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-medium">
                      <span>ID: #{team.id}</span>
                      <span>Creator: {team.created_by_username || `User #${team.created_by}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backup Numeric Navigation */}
          <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-4.5 h-4.5 text-indigo-400" />
                Open Team by ID
              </h2>
              <p className="text-zinc-400 text-xs">
                Direct numeric navigation to a team workspace. Useful as a backup or for rapid entry.
              </p>
            </div>
            
            <form onSubmit={handleFallbackSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Enter numeric team ID"
                  value={fallbackId}
                  onChange={(e) => setFallbackId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer group"
              >
                <span>Navigate to Team</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <h2 className="text-lg font-bold text-white mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Frontend Engineers"
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={creatingTeam}
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="What is this team working on?"
                  rows={3}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  disabled={creatingTeam}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTeamName("");
                    setNewTeamDesc("");
                  }}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  disabled={creatingTeam}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center min-w-[5rem]"
                  disabled={creatingTeam}
                >
                  {creatingTeam ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
