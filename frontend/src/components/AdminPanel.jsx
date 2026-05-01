import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import TaskCard from "./TaskCard";

const AdminPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    const { data } = await api.get("/tasks/all");
    setTasks(data);
  };

  useEffect(() => {
    loadTasks().catch((error) => setMessage(error.response?.data?.message || "Could not load tasks"));
  }, []);

  const deleteTask = async (id) => {
    await api.delete(`/tasks/all/${id}`);
    setTasks((current) => current.filter((task) => task._id !== id));
  };

  return (
    <section className="page-panel">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>All Tasks</h1>
        </div>
        <span className="count-badge">{tasks.length} total</span>
      </div>

      {message && <p className="alert">{message}</p>}

      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} showOwner onDelete={deleteTask} />
        ))}
      </div>

      {!tasks.length && !message && <p className="empty-state">No tasks have been created yet.</p>}
    </section>
  );
};

export default AdminPanel;
