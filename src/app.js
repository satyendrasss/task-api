require("dotenv").config();   // Load .env

const express = require("express");
const cors = require("cors");
// const sequelize = require("./config/database");
const { sequelize } = require("./models");

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dailyReportingRoutes = require("./routes/dailyReportingRoutes");

const app = express();

// const allowedOrigins = [
//   'http://localhost:5173',
// ];
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Task API.');
});
app.get('/api', (req, res) => {
  res.send('Task API.');
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", dailyReportingRoutes);


// Sync DB
// sequelize.sync()
//     .then(() => console.log("Database connected & synced"))
//     .catch(err => console.error("DB Error:", err));

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");
  } catch (error) {
    console.error("DB error:", error);
  }
})();

module.exports = app;
