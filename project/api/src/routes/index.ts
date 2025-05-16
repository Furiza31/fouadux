import fs from "fs";
import path from "path";

/**
 * Load all routes from the routes folder
 * @returns {Array} allRoutes - Array of all routes
 */
const routes = (): Array<any> => {
  const allRoutes = [];
  const routesPath = path.join(__dirname);
  const folders = fs
    .readdirSync(routesPath)
    .filter((folder) => folder !== "index.ts")
    .filter((folder) => folder !== "index.js");
  for (const folder of folders) {
    const routePath = path.join(routesPath, folder);
    const files = fs
      .readdirSync(routePath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of files) {
      try {
        const route = require(path.join(routePath, file)).default;
        allRoutes.push(route);
        console.log(`Route loaded from ${routePath}/${file}`);
      } catch (error) {
        console.log("-".repeat(50));
        console.error(`Error loading routes from ${routePath}/${file}`);
        console.error(error);
        console.log("-".repeat(50));
      }
    }
  }
  return allRoutes;
};

export default routes;
