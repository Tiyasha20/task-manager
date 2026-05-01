const express = require("express");
const {
  createTask,
  deleteAnyTask,
  deleteTask,
  getAllTasks,
  getTasks,
  updateTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/all", adminOnly, getAllTasks);
router.delete("/all/:id", adminOnly, deleteAnyTask);

module.exports = router;
