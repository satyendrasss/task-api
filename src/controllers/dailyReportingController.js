const { DailyReportingModel, ProjectModel } = require("../models");

/* ================= CREATE REPORT ================= */
exports.createReport = async (req, res) => {
  try {
    const { project_id, title, reporting_date } = req.body;
    const user_id = req.user.id; // from JWT

    if (!project_id || !title || !reporting_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Optional: prevent duplicate per project per day per user
    const exists = await DailyReportingModel.findOne({
      where: {
        project_id,
        reporting_date,
        user_id,
      },
    });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Report already exists for this date" });
    }

    const report = await DailyReportingModel.create({
      user_id,
      project_id,
      title,
      reporting_date,
    });

    res.status(201).json({
      message: "Daily report created",
      report,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL REPORTS ================= */
exports.getReports = async (req, res) => {
  try {
    const reports = await DailyReportingModel.findAll({
      include: {
        model: ProjectModel,
        attributes: ["id", "name"],
      },
      order: [["reporting_date", "DESC"]],
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET REPORT BY ID ================= */
exports.getReportById = async (req, res) => {
  try {
    const report = await DailyReportingModel.findByPk(req.params.id, {
      include: {
        model: ProjectModel,
        attributes: ["id", "name"],
      },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= UPDATE REPORT ================= */
exports.updateReport = async (req, res) => {
  try {
    const { title, reporting_date } = req.body;
    const { id } = req.params;

    const report = await DailyReportingModel.findByPk(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Only owner can update
    if (report.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (title) report.title = title;
    if (reporting_date) report.reporting_date = reporting_date;

    await report.save();

    res.json({
      message: "Report updated",
      report,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= DELETE REPORT ================= */
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await DailyReportingModel.findByPk(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Only owner can delete
    if (report.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await report.destroy(); // soft delete

    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
