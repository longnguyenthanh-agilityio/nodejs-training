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

// Function to load models asynchronously
const loadModels = async () => {
  const modelFiles = readdirSync(modelsDir).filter((file) => file.endsWith(".js"));

  const modelPromises = modelFiles.map(async (file) => {
    const modelPath = pathToFileURL(resolve(join(modelsDir, file))).toString();
    const model = await import(modelPath);

    if (model && model.default && model.default.name) {
      db.models[model.default.name] = model.default;
    } else {
      console.error(`Failed to load model from file: ${file}`);
    }
  });

  // Wait for all model imports to complete
  await Promise.all(modelPromises);
};

// Main function to load models and set up associations
const initializeModels = async () => {
  await loadModels();

  console.log("Loaded models:", Object.keys(db.models)); // Ensure models are loaded

  // Set up associations (if any)
  Object.keys(db.models).forEach((key) => {
    if (db.models[key].associate) {
      db.models[key].associate(db.models);
    }
  });
};

// Initialize the models
initializeModels();

export default db;
