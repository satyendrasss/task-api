const { ProjectModel } = require("../models");

/* ================= CREATE PROJECT ================= */
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const exists = await ProjectModel.findOne({ where: { name } });
    if (exists) {
      return res.status(409).json({ message: "Project already exists" });
    }

    const project = await ProjectModel.create({ name, description });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL PROJECTS ================= */
exports.getProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET PROJECT BY ID ================= */
exports.getProjectById = async (req, res) => {
  try {
    const project = await ProjectModel.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= UPDATE PROJECT ================= */
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const project = await ProjectModel.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= DELETE PROJECT ================= */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProjectModel.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted (soft)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
