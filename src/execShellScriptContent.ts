import fs from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

const dirPathScripts = path.join(__dirname, "scripts");

fs.ensureDirSync(dirPathScripts); // 保证脚本目录的存在

/**
 * 执行脚本(传入字符串)
 * @param {string} scriptContent 脚本文件的内容（注意是直接传入脚本文本内容而不是脚本文件的路径）
 * @return {Promise<string>} 输出的内容
 */
function execShellScriptContent(scriptContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dirPathScripts, uuidv4() + ".sh");
    fs.writeFileSync(filePath, scriptContent);
    const readable = new Readable();
    readable.setEncoding("utf-8");
    readable._read = () => {};
    const handle = spawn("sh", [filePath]);
    handle.stderr.on("data", (data) => {
      readable.push(data);
    });
    handle.stdout.on("data", (data) => {
      readable.push(data);
    });
    handle.on("error", () => {
      readable.push(null);
      reject("error");
    });
    handle.on("close", () => {
      readable.push(null);
      fs.removeSync(filePath);
      resolve(readable.read());
    });
  });
}

export default execShellScriptContent;
