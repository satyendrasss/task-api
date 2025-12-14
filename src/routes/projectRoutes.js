const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, role("admin"), projectController.createProject);
router.get("/", auth, role("admin"), projectController.getProjects);
router.get("/:id", auth, role("admin"), projectController.getProjectById);
router.put("/:id", auth, role("admin"), projectController.updateProject);
router.delete("/:id", auth, role("admin"), projectController.deleteProject);

module.exports = router;
