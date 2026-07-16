import { glob, rm } from "node:fs/promises";

async function cleanFiles() {
  try {
    const files = glob(["**/dist/", "**/*.tsbuildinfo"], { exclude: ["**/node_modules/**"] });

    for await (const file of files) {
      await rm(file, { recursive: true });
    }

    console.log("Cleanup complete!");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    console.error(`Error during cleanup: ${message}`);
  }
}

cleanFiles();
