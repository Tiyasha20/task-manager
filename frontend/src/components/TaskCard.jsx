import { Edit3, Trash2 } from "lucide-react";

const statusLabels = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
};

const TaskCard = ({ task, onDelete, onEdit, showOwner = false }) => {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <h3>{task.title}</h3>
          {showOwner && task.owner && (
            <p className="owner-line">
              {task.owner.name} · {task.owner.email}
            </p>
          )}
        </div>
        <span className={`status-pill ${task.status}`}>{statusLabels[task.status]}</span>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-actions">
        {onEdit && (
          <button className="secondary-button" type="button" onClick={() => onEdit(task)}>
            <Edit3 size={17} />
            Edit
          </button>
        )}
        <button className="danger-button" type="button" onClick={() => onDelete(task._id)}>
          <Trash2 size={17} />
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
