import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask, getProfile } from "../api";
import TaskForm from "./TaskForm";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [user, setUser] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filter) params.status = filter;
      if (search) params.search = search;
      const { data } = await getTasks(params);
      setTasks(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await getProfile();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  // Fetch tasks automatically whenever search or filter changes
  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300); // 300ms debounce
    return () => clearTimeout(delayDebounceFn);
  }, [filter, search]);

  const onAdd = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const onEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const onSave = async (form) => {
    try {
      if (editTask) await updateTask(editTask.id, form);
      else await createTask(form);
      setModalOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      alert(err?.response?.data?.detail || "Save failed");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed");
    }
  };

  const counts = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks]
  );

  return (
    <div className="space-y-6">
      {/* User Profile */}
      {user && (
        <div className="text-right text-gray-600">
          Logged in as: <span className="font-semibold">{user.username}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat title="Total Tasks" value={counts.total} />
        <Stat title="In Progress" value={counts.inProgress} />
        <Stat title="Completed" value={counts.completed} />
      </div>

      {/* Search & Filter Section */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <label className="font-medium text-gray-700">Search Tasks:</label>
          <input
            type="text"
            className="input"
            placeholder="Enter task title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <label className="font-medium text-gray-700">Filter by Status:</label>
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Your Tasks</h2>
        {loading ? (
          <div className="text-gray-500">Loading tasks…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-gray-500">No tasks found.</div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border rounded-xl p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{task.title}</div>
                    <div className="text-sm text-gray-600">
                      {task.description || "—"}
                    </div>
                    <div className="text-xs mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => onEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        initial={editTask}
      />
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="card flex items-center justify-between">
      <div className="text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
