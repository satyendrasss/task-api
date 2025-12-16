const { DailyReportingModel, ProjectModel } = require("../models");

/* ================= CREATE REPORT ================= */
exports.createReport = async (req, res) => {
  try {
    const { project_id, title, reporting_date } = req.body;
    const user_id = req.user.id;

    if (!project_id || !title || !reporting_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure title is always an array
    const titles = Array.isArray(title) ? title : [title];

    if (titles.length === 0) {
      return res.status(400).json({ message: "At least one task is required" });
    }

    // Find existing tasks for same user/project/date
    const existingReports = await DailyReportingModel.findAll({
      where: {
        user_id,
        project_id,
        reporting_date,
      },
      attributes: ["title"],
    });

    const existingTitles = existingReports.map(r => r.title);

    // Filter out duplicates
    const newTitles = titles.filter(
      t => !existingTitles.includes(t)
    );

    if (newTitles.length === 0) {
      return res.status(409).json({
        message: "All tasks already exist for this date",
      });
    }

    // Prepare records
    const reportsToCreate = newTitles.map(taskTitle => ({
      user_id,
      project_id,
      reporting_date,
      title: taskTitle,
    }));

    const reports = await DailyReportingModel.bulkCreate(reportsToCreate);

    res.status(201).json({
      message: "Daily reports created",
      count: reports.length,
      reports,
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

// Daily Reports
exports.getDailyReports = async (req, res) => {
  const reports = await DailyReportingModel.findAll({
    where: { user_id: req.user.id },
    include: { model: ProjectModel, attributes: ["id", "name"] },
    order: [["reporting_date", "DESC"]],
  });

  // Group by date + project
  const grouped = {};
  reports.forEach(r => {
    const key = `${r.reporting_date}_${r.project_id}`;
    if (!grouped[key]) {
      grouped[key] = {
        date: r.reporting_date,
        project: r.ProjectModel,
        tasks: [],
      };
    }
    grouped[key].tasks.push(r.title);
  });

  res.json(Object.values(grouped));
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
