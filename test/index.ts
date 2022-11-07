import { execShellScriptContent, execShellScriptFile } from "../src/index";

async function main() {
  const results1 = await execShellScriptContent(`ls -la`);
  console.log(results1);
  const results2 = await execShellScriptFile(__dirname + "/test.sh");
  console.log(results2);
}

main();
