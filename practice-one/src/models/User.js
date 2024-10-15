import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../libs/db.js";

const User = db.sequelize.define(
  "User",
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

User.associate = (models) => {
  if (models.Card) {
    User.hasMany(models.Card, {
      foreignKey: "userId",
      as: "primaryCards",
    });
  }
};

User.isPassword = (encodedPassword, password) => {
  return bcrypt.compareSync(password, encodedPassword);
};

export default User;
