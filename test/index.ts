import { execShellScriptContent } from "../src/index";

async function main() {
  const results = await execShellScriptContent(`echo hello`);
  console.log(results);
}

main();
