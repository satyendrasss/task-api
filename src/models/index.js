const sequelize = require("../config/database");

const User = require("./UserModel");
const ProjectModel = require("./ProjectModel");
const DailyReportingModel = require("./DailyReportingModel");

// Associations
ProjectModel.hasMany(DailyReportingModel, {
  foreignKey: "project_id",
});

DailyReportingModel.belongsTo(ProjectModel, {
  foreignKey: "project_id",
});

module.exports = {
  sequelize,
  User,
  ProjectModel,
  DailyReportingModel,
};
