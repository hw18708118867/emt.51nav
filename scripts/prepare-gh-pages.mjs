import { writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");

await writeFile(path.join(outDir, ".nojekyll"), "");

