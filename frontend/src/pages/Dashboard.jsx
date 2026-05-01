import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    loadTasks().catch((error) => setMessage(error.response?.data?.message || "Could not load tasks"));
  }, []);

  const saveTask = async (task) => {
    setMessage("");

    if (editingTask) {
      const { data } = await api.put(`/tasks/${editingTask._id}`, task);
      setTasks((current) => current.map((item) => (item._id === data._id ? data : item)));
      setEditingTask(null);
      return;
    }

    const { data } = await api.post("/tasks", task);
    setTasks((current) => [data, ...current]);
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((current) => current.filter((task) => task._id !== id));
  };

  const completedCount = tasks.filter((task) => task.status === "completed").length;

  return (
    <section className="dashboard-layout">
      <div className="page-panel">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Welcome, {user?.name}</p>
            <h1>Your Tasks</h1>
          </div>
          <span className="count-badge">
            {completedCount}/{tasks.length} complete
          </span>
        </div>

        {message && <p className="alert">{message}</p>}

        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDelete={deleteTask} onEdit={setEditingTask} />
          ))}
        </div>

        {!tasks.length && !message && <p className="empty-state">No tasks yet. Create your first one.</p>}
      </div>

      <aside className="side-panel">
        <h2>{editingTask ? "Edit Task" : "Create Task"}</h2>
        <TaskForm
          initialTask={editingTask}
          onCancel={() => setEditingTask(null)}
          onSubmit={saveTask}
        />
      </aside>
    </section>
  );
};

export default Dashboard;
