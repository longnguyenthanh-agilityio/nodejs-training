import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../libs/db.js";

const Users = db.sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      },
    },
  },
);

Users.associate = (models) => {
  Users.belongsTo(models.Cards);
};

Users.isPassword = (encodedPassword, password) => {
  return bcrypt.compareSync(password, encodedPassword);
};

export default Users;
