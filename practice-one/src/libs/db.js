import Sequelize from "sequelize";
import { dirname, resolve, join } from "path";
import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { config } from "./config.js";

const sequelize = new Sequelize(config.database, config.username, config.password, config.params);

const db = { sequelize, Sequelize, models: {} };
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targetPath = resolve(__dirname, "../../src");
const modelsDir = join(targetPath, "models");

readdirSync(modelsDir).forEach(async (file) => {
  if (file.endsWith(".js")) {
    const model = await import(pathToFileURL(resolve(join(modelsDir, file)).toString()));
    db.models[model.default.name] = model.default;
  }
});

Object.keys(db.models).forEach((key) => {
  if (db.models[key].associate) {
    db.models[key].associate(db.models);
  }
});

export default db;
