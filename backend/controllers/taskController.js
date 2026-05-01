const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description = "", status = "pending" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      owner: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own tasks" });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own tasks" });
    }

    await task.deleteOne();
    return res.json({ message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

const deleteAnyTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    return res.json({ message: "Task deleted by admin" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  deleteAnyTask,
};
