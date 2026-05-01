import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyTask = {
  title: "",
  description: "",
  status: "pending",
};

const TaskForm = ({ initialTask, onCancel, onSubmit }) => {
  const [task, setTask] = useState(emptyTask);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTask(initialTask || emptyTask);
  }, [initialTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    await onSubmit(task);
    setIsSaving(false);

    if (!initialTask) {
      setTask(emptyTask);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Task title"
        required
      />
      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
        rows="3"
      />
      <div className="form-row">
        <select name="status" value={task.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" disabled={isSaving}>
          <Save size={18} />
          {isSaving ? "Saving" : initialTask ? "Update" : "Create"}
        </button>
        {initialTask && (
          <button className="secondary-button" type="button" onClick={onCancel}>
            <X size={18} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
