const express = require("express");
const router = express.Router();

const dailyReportingController = require("../controllers/dailyReportingController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, role("admin","manager", "user"), dailyReportingController.createReport);
router.get("/", auth, role("admin","manager", "user"), dailyReportingController.getReports);
router.get("/:id", auth, role("admin","manager", "user"), dailyReportingController.getReportById);
router.put("/:id", auth, role("admin","manager", "user"), dailyReportingController.updateReport);
router.delete("/:id", auth, role("admin","manager", "user"), dailyReportingController.deleteReport);

// router.post("/", auth, role("admin", "manager", "user"), createReport);
// router.get("/", auth, role("admin", "manager"), getAllReports);


module.exports = router;
