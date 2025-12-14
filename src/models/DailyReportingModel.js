const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DailyReporting = sequelize.define(
  "DailyReporting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    reporting_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "daily_reportings",
    timestamps: true,
    paranoid: true,

    indexes: [
      { fields: ["user_id"] },
      { fields: ["project_id"] },
      { fields: ["reporting_date"] },

      // Prevent duplicate reports per project per day
    //   {
    //     unique: true,
    //     fields: ["project_id", "reporting_date"],
    //   },
    ],
  }
);

module.exports = DailyReporting;
