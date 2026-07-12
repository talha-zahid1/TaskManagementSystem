import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  User,
  Plus,
  Trash2,
  Edit2,
  Search,
  Users,
  Briefcase,
  Shield,
  Trash,
  AlertTriangle,
  FileText,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

// Types matching backend casing
interface Task {
  id: number;
  title: string;
  description: string;
  team_id: number;
  assigned_to: number;
  created_at: string;
  status: "todo" | "Progress" | "Review" | "Completed";
  priority: "Low" | "Medium" | "High";
  Due_date: string; // Capital 'D'
  update_at: string | null; // No 'd'
}

interface Member {
  team_id: number;
  user_id: number;
  username?: string;
  role: "Admin" | "Member";
  joined_at: string;
}

interface Team {
  id: number;
  team_name: string;
  team_description: string;
  created_at: string;
  created_by: number;
  created_by_username?: string;
}

interface TeamStats {
  total_tasks: number;
  In_progress: number;
  Completed: number;
  review_tasks: number;
  todo_tasks: number;
  high_priority_tasks: number;
  over_due_tasks: number;
}

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const numericTeamId = Number(teamId);

  // States
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);

  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Member Search / Add States
  const [searchUsername, setSearchUsername] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchedUser, setSearchedUser] = useState<{ id?: number; user_id?: number; username: string; email: string } | null>(null);
  const [addUserId, setAddUserId] = useState("");
  const [addRole, setAddRole] = useState<"Admin" | "Member">("Member");
  const [addingMember, setAddingMember] = useState(false);

  // Create Task Modal States
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskStatus, setTaskStatus] = useState<"todo" | "Progress" | "Review" | "Completed">("todo");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  // Edit Task Modal States
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editStatus, setEditStatus] = useState<"todo" | "Progress" | "Review" | "Completed">("todo");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [editDueDate, setEditDueDate] = useState("");
  const [updatingTask, setUpdatingTask] = useState(false);

  // Delete Confirmation States
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [deletingTaskProgress, setDeletingTaskProgress] = useState(false);
  const [showDeleteTeam, setShowDeleteTeam] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState(false);

  // Checks
  const currentMember = members.find((member) => Number(member.user_id) === Number(userId));
  const isAdmin =
    !!team &&
    userId !== null &&
    (Number(team.created_by) === Number(userId) || currentMember?.role?.toLowerCase() === "admin");

  // 1. Fetch Team Details (By listing all teams and filtering)
  const fetchTeamDetails = async () => {
    setLoadingTeam(true);
    try {
      const response = await api.get("/get-teams/");
      if (response.data.status) {
        const foundTeam = response.data.data.find((t: Team) => t.id === numericTeamId);
        if (foundTeam) {
          setTeam(foundTeam);
        } else {
          // If not found in user's fetched list, fallback placeholder
          setTeam({
            id: numericTeamId,
            team_name: `Team Workspace #${numericTeamId}`,
            team_description: "Workspace open via ID navigation",
            created_at: new Date().toISOString(),
            created_by: 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch team header detail:", error);
      setTeam({
        id: numericTeamId,
        team_name: `Team Workspace #${numericTeamId}`,
        team_description: "Workspace open via ID navigation",
        created_at: new Date().toISOString(),
        created_by: 0,
      });
    } finally {
      setLoadingTeam(false);
    }
  };

  // 2. Fetch Members
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await api.get(`/get-team-mem/${numericTeamId}/`);
      if (response.data.status) {
        setMembers(response.data.members);
        // Default assignee in modal
        if (response.data.members.length > 0) {
          setTaskAssignee(String(response.data.members[0].user_id));
        }
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast.error("Could not fetch team members");
    } finally {
      setLoadingMembers(false);
    }
  };

  // 3. Fetch Tasks (Filter client-side by team_id)
  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await api.get("/tasks/");
      if (response.data.status) {
        const filteredTasks = response.data.task.filter(
          (t: Task) => t.team_id === numericTeamId
        );
        setTasks(filteredTasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Could not fetch tasks list");
    } finally {
      setLoadingTasks(false);
    }
  };

  // 4. Fetch Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await api.get(`/statistics/${numericTeamId}/`);
      // Scoped team statistics
      setStats(response.data);
    } catch (error: any) {
      console.error("Failed to fetch team stats:", error);
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const refreshAll = () => {
    fetchTeamDetails();
    fetchMembers();
    fetchTasks();
    fetchStats();
  };

  useEffect(() => {
    if (numericTeamId) {
      refreshAll();
    }
  }, [numericTeamId]);

  // Username Search (Exact Match, no trailing slash)
  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) {
      toast.error("Please enter a username to search");
      return;
    }

    setSearchingUser(true);
    setSearchedUser(null);
    try {
      // Endpoint format: /search-user?q=... (no trailing slash)
      const response = await api.get(`/search-user?q=${encodeURIComponent(searchUsername)}`);
      if (response.data.status) {
        setSearchedUser(response.data);
        const targetUserId = response.data.user_id !== undefined ? response.data.user_id : response.data.id;
        if (targetUserId !== undefined) {
          setAddUserId(String(targetUserId));
        } else {
          setAddUserId("");
          toast.success("User found, please type their numeric ID manually.");
        }
      } else {
        toast.error("User not found");
      }
    } catch (error: any) {
      console.error("Search user error:", error);
      const msg = error.response?.data?.message || "User Not Found";
      toast.error(msg);
    } finally {
      setSearchingUser(false);
    }
  };

  // Add Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(addUserId);
    if (!addUserId || isNaN(id)) {
      toast.error("Please provide a valid numeric User ID");
      return;
    }

    setAddingMember(true);
    try {
      // POST /add-team-mem/<team_id>/
      // Must include team_id inside request body as well
      const response = await api.post(`/add-team-mem/${numericTeamId}/`, {
        team_id: numericTeamId,
        user_id: id,
        role: addRole,
      });

      if (response.data.status) {
        toast.success("Member added successfully!");
        setAddUserId("");
        setSearchUsername("");
        setSearchedUser(null);
        fetchMembers();
        fetchStats();
      } else {
        toast.error(response.data.message || "Failed to add member");
      }
    } catch (error: any) {
      console.error("Add member error:", error);
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  // Remove Member
  const handleRemoveMember = async (targetUserId: number) => {
    if (!window.confirm(`Are you sure you want to remove User #${targetUserId} from the team?`)) {
      return;
    }

    try {
      // POST /rem-team-mem/<team_id>/ with body { user_id: number }
      // Backend status bug: HTTP 200 is success, ignore status: false
      await api.post(`/rem-team-mem/${numericTeamId}/`, {
        user_id: targetUserId,
      });
      
      toast.success("Member removed successfully");
      fetchMembers();
      fetchTasks(); // Assignees might get unassigned or altered
      fetchStats();
    } catch (error: any) {
      console.error("Remove member error:", error);
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDesc.trim() || !taskDueDate || !taskAssignee) {
      toast.error("Please fill in all task fields");
      return;
    }

    setCreatingTask(true);
    try {
      // POST /tasks/
      await api.post("/tasks/", {
        team_id: numericTeamId,
        assigned_to: Number(taskAssignee),
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        priority: taskPriority,
        Due_date: new Date(taskDueDate).toISOString(),
      });

      toast.success("Task created successfully!");
      setShowCreateTask(false);
      setTaskTitle("");
      setTaskDesc("");
      setTaskDueDate("");
      fetchTasks();
      fetchStats();
    } catch (error: any) {
      console.error("Create task error:", error);
      toast.error(error.response?.data?.message || "Failed to add task");
    } finally {
      setCreatingTask(false);
    }
  };

  // Open Edit Task Modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditAssignee(String(task.assigned_to));
    setEditStatus(task.status);
    setEditPriority(task.priority);
    // Format ISO string to YYYY-MM-DD for standard input
    if (task.Due_date) {
      setEditDueDate(task.Due_date.substring(0, 10));
    } else {
      setEditDueDate("");
    }
  };

  // Submit Edit Task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!editTitle.trim() || !editDesc.trim() || !editDueDate || !editAssignee) {
      toast.error("Fields cannot be empty");
      return;
    }

    setUpdatingTask(true);
    try {
      // PUT /tasks/<id>/
      await api.put(`/tasks/${editingTask.id}/`, {
        title: editTitle,
        description: editDesc,
        assigned_to: Number(editAssignee),
        status: editStatus,
        priority: editPriority,
        Due_date: new Date(editDueDate).toISOString(),
      });

      toast.success("Task updated successfully!");
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch (error: any) {
      console.error("Update task error:", error);
      const status = error.response?.status;
      const msg = error.response?.data?.message || "";
      if (status === 403 || (status === 400 && (msg.toLowerCase().includes("only admin") || msg.toLowerCase().includes("permission")))) {
        toast.error("You don't have permission to edit this task");
      } else {
        toast.error(msg || "Failed to update task");
      }
    } finally {
      setUpdatingTask(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;

    setDeletingTaskProgress(true);
    try {
      // DELETE /tasks/<id>/
      await api.delete(`/tasks/${deletingTaskId}/`);
      
      toast.success("Task deleted successfully");
      setDeletingTaskId(null);
      fetchTasks();
      fetchStats();
    } catch (error: any) {
      console.error("Delete task error:", error);
      const status = error.response?.status;
      const msg = error.response?.data?.message || "";
      if (status === 403 || (status === 400 && (msg.toLowerCase().includes("only admin") || msg.toLowerCase().includes("permission")))) {
        toast.error("You don't have permission to edit this task");
      } else {
        toast.error(msg || "Failed to delete task");
      }
    } finally {
      setDeletingTaskProgress(false);
    }
  };

  // Delete Team
  const handleDeleteTeam = async () => {
    setDeletingTeam(true);
    try {
      await api.delete(`/teams/${numericTeamId}/`);
      toast.success("Team deleted successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Delete team error:", error);
      toast.error(error.response?.data?.message || "Failed to delete team");
    } finally {
      setDeletingTeam(false);
      setShowDeleteTeam(false);
    }
  };

  // Check if date is overdue
  const isOverdue = (dueDateStr: string) => {
    return new Date(dueDateStr) < new Date();
  };

  // Render Status Column
  const renderColumn = (colStatus: "todo" | "Progress" | "Review" | "Completed", label: string) => {
    const colTasks = tasks.filter((t) => t.status === colStatus);

    return (
      <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-4 flex flex-col min-h-[500px]">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                colStatus === "todo"
                  ? "bg-blue-500"
                  : colStatus === "Progress"
                  ? "bg-amber-500 animate-pulse"
                  : colStatus === "Review"
                  ? "bg-purple-500"
                  : "bg-emerald-500"
              }`}
            ></span>
            <h3 className="font-bold text-white text-sm tracking-wide">{label}</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-semibold">
            {colTasks.length}
          </span>
        </div>

        {/* Task Cards Container */}
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
          {colTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
              <FileText className="w-8 h-8 text-zinc-500 mb-1" />
              <p className="text-[11px] font-medium text-zinc-400">Empty column</p>
            </div>
          ) : (
            colTasks.map((task) => {
              const overdue = isOverdue(task.Due_date) && task.status !== "Completed";
              const assigneeInfo = members.find((m) => m.user_id === task.assigned_to);

              return (
                <div
                  key={task.id}
                  className="group relative bg-zinc-900/60 border border-zinc-850 hover:border-zinc-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {/* Action Icons */}
                  {isAdmin && (
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 bg-zinc-950/70 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingTaskId(task.id)}
                        className="p-1.5 bg-zinc-950/70 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* Priority Badge */}
                    <div className="flex justify-between items-center pr-12">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          task.priority === "High"
                            ? "bg-red-950/50 border border-red-900/40 text-red-400"
                            : task.priority === "Medium"
                            ? "bg-amber-950/50 border border-amber-900/40 text-amber-400"
                            : "bg-blue-950/50 border border-blue-900/40 text-blue-400"
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                      <span className="text-[10px] text-zinc-600 font-medium">#{task.id}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h4>

                    <p className="text-zinc-400 text-xs line-clamp-2 min-h-[1.5rem]">
                      {task.description}
                    </p>

                    <div className="pt-2 border-t border-zinc-950 flex items-center justify-between text-[10px]">
                      {/* Assignee */}
                      <div className="flex items-center gap-1 text-zinc-400">
                        <User className="w-3 h-3 text-indigo-400" />
                        <span className="font-semibold">
                          {assigneeInfo ? assigneeInfo.username : `User #${task.assigned_to}`}
                          {assigneeInfo && ` (${assigneeInfo.role})`}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div
                        className={`flex items-center gap-1 ${
                          overdue ? "text-rose-400 font-semibold" : "text-zinc-500"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.Due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#0b0f19] text-zinc-100 p-6 md:p-10 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation back */}
        <Link to="/dashboard" className="inline-flex items-center text-xs font-semibold text-zinc-400 hover:text-indigo-400 transition-colors gap-1">
          &larr; Back to Dashboard
        </Link>

        {/* Header Widget */}
        {loadingTeam ? (
          <div className="h-28 bg-zinc-900/40 border border-zinc-850 rounded-2xl animate-pulse"></div>
        ) : team ? (
          <div className="relative overflow-hidden bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {team.team_name}
                </h1>
                {isAdmin && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-900 text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-sm max-w-2xl">
                {team.team_description || "No description provided."}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
                <span>Created: {new Date(team.created_at).toLocaleDateString()}</span>
                <span>Workspace ID: #{team.id}</span>
                <span>Creator: {team.created_by_username || `User #${team.created_by}`}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto">
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
                <button
                  onClick={() => setShowDeleteTeam(true)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-950/20 hover:bg-red-950/35 border border-red-900/50 text-red-300 hover:text-red-200 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
                >
                  <Trash className="w-4 h-4" />
                  <span>Delete Team</span>
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* Team Stats Summary */}
        <div className="space-y-4">
          <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
            Team Statistics
          </h2>
          {loadingStats ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-zinc-900/40 border border-zinc-850 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total Tasks</p>
                <p className="text-2xl font-black mt-1 text-white">{stats.total_tasks}</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">In Progress</p>
                <p className="text-2xl font-black mt-1 text-amber-500">{stats.In_progress}</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-black mt-1 text-emerald-500">{stats.Completed}</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4">
                <p className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider text-rose-400">Overdue Tasks</p>
                <p className="text-2xl font-black mt-1 text-rose-400">{stats.over_due_tasks}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl">
              <p className="text-zinc-500 text-xs">No stats data found for this workspace.</p>
            </div>
          )}
        </div>

        {/* Task Board Columns */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
              Task Kanban Board
            </h2>
            {!isAdmin && (
              <p className="text-xs text-zinc-500">
                Only team admins can add, edit, or delete tasks.
              </p>
            )}
          </div>
          {loadingTasks ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-zinc-900/40 border border-zinc-850 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderColumn("todo", "To Do")}
              {renderColumn("Progress", "In Progress")}
              {renderColumn("Review", "In Review")}
              {renderColumn("Completed", "Completed")}
            </div>
          )}
        </div>

        {/* Members Management Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Members List */}
          <div className="lg:col-span-2 space-y-4 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-indigo-400" />
              Team Members ({members.length})
            </h2>

            {loadingMembers ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-12 bg-zinc-900/40 border border-zinc-850 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : members.length === 0 ? (
              <p className="text-zinc-500 text-xs">No members associated with this workspace yet.</p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => {
                  const isCreator = team && Number(team.created_by) === Number(member.user_id);
                  
                  return (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-zinc-700">
                          <User className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">
                              {member.username || `User #${member.user_id}`}
                            </span>
                            {isCreator && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md font-medium">
                                Creator
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 font-medium text-zinc-300">
                          {member.role}
                        </span>

                        {isAdmin && !isCreator && (
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="p-1.5 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 rounded-lg text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Admin Member Management Panel */}
          {isAdmin && (
            <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
              
              {/* User Username Lookup */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-indigo-400" />
                    Lookup Member Account
                  </h3>
                  <p className="text-zinc-500 text-[11px]">
                    Enter Exact Username (Case-Sensitive, No Autocomplete)
                  </p>
                </div>
                <form onSubmit={handleSearchUser} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Exact Username"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    disabled={searchingUser}
                  >
                    {searchingUser ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      "Find"
                    )}
                  </button>
                </form>

                {searchedUser && (
                  <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
                    <div className="text-[11px]">
                      <p className="text-zinc-400">Username: <span className="text-white font-bold">{searchedUser.username}</span></p>
                      <p className="text-zinc-400">Email: <span className="text-white font-medium">{searchedUser.email}</span></p>
                      {searchedUser.user_id !== undefined || searchedUser.id !== undefined ? (
                        <p className="text-zinc-400">User ID: <span className="text-indigo-400 font-bold">#{searchedUser.user_id !== undefined ? searchedUser.user_id : searchedUser.id}</span></p>
                      ) : (
                        <p className="text-amber-400 font-semibold mt-1">User ID is absent. Enter numeric ID manually below.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-zinc-900"></div>

              {/* Add Member Form */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4.5 h-4.5 text-indigo-400" />
                  Add Member to Team
                </h3>
                <form onSubmit={handleAddMember} className="space-y-3.5">
                  <div>
                    <label className="block text-zinc-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                      User Numeric ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 42"
                      value={addUserId}
                      onChange={(e) => setAddUserId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                      Workspace Role
                    </label>
                    <select
                      value={addRole}
                      onChange={(e) => setAddRole(e.target.value as "Admin" | "Member")}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1 py-2 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/15 transition-all cursor-pointer"
                    disabled={addingMember}
                  >
                    {addingMember ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      "Add Member"
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <h2 className="text-lg font-bold text-white mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={creatingTask}
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task details..."
                  rows={3}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  disabled={creatingTask}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Assignee
                  </label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={creatingTask}
                  >
                    {members.length === 0 ? (
                      <option value="">No members</option>
                    ) : (
                      members.map((m) => (
                        <option key={m.user_id} value={m.user_id}>
                          User #{m.user_id} ({m.role})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as "Low" | "Medium" | "High")}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={creatingTask}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={creatingTask}
                  >
                    <option value="todo">To Do</option>
                    <option value="Progress">In Progress</option>
                    <option value="Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={creatingTask}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  disabled={creatingTask}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer min-w-[5rem] flex items-center justify-center"
                  disabled={creatingTask}
                >
                  {creatingTask ? (
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

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <h2 className="text-lg font-bold text-white mb-4">Edit Task</h2>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={updatingTask}
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  disabled={updatingTask}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Assignee
                  </label>
                  <select
                    value={editAssignee}
                    onChange={(e) => setEditAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={updatingTask}
                  >
                    {members.map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        User #{m.user_id} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as "Low" | "Medium" | "High")}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={updatingTask}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={updatingTask}
                  >
                    <option value="todo">To Do</option>
                    <option value="Progress">In Progress</option>
                    <option value="Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={updatingTask}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  disabled={updatingTask}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer min-w-[5rem] flex items-center justify-center"
                  disabled={updatingTask}
                >
                  {updatingTask ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {deletingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-slide-up space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Task?</h3>
            </div>
            
            <p className="text-zinc-400 text-xs">
              Are you sure you want to permanently delete this task? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeletingTaskId(null)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                disabled={deletingTaskProgress}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center min-w-[5rem]"
                disabled={deletingTaskProgress}
              >
                {deletingTaskProgress ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Confirmation Modal */}
      {showDeleteTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-slide-up space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Team?</h3>
            </div>

            <p className="text-zinc-400 text-xs">
              This will permanently delete the team, its members, and all tasks in this workspace.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteTeam(false)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                disabled={deletingTeam}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTeam}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center min-w-[6rem]"
                disabled={deletingTeam}
              >
                {deletingTeam ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "Delete Team"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;
