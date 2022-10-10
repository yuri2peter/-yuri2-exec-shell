import { execShellScriptContent } from "../src/index";

async function main() {
  const results = await execShellScriptContent(`ls -la`);
  console.log(results);
}

main();
