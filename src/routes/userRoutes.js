const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/", auth, role("admin"), userController.getUsers);
router.get("/:id", auth, userController.getUserById);
router.delete("/:id", auth, role("admin"), userController.deleteUser);

module.exports = router;
