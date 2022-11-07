import path from "path";
import { spawn } from "child_process";
import { Readable } from "stream";
const { v4: uuidv4 } = require("uuid");
const fs = require("fs-extra");

const dirPathScripts = path.join(__dirname, "scripts");

fs.ensureDirSync(dirPathScripts); // 保证脚本目录的存在

/**
 * 执行sh脚本(传入字符串)
 * @param {string} scriptContent 脚本文件的内容（注意是直接传入脚本文本内容而不是脚本文件的路径）
 * @return {Promise<string>} 输出的内容
 */
export function execShellScriptContent(scriptContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dirPathScripts, uuidv4() + ".sh");
    fs.writeFileSync(filePath, scriptContent);
    execShellScriptFile(filePath)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        fs.removeSync(filePath);
      });
  });
}

/**
 * 执行sh脚本(传入文件路径)
 * @param {string} scriptContent 脚本文件的内容（注意是直接传入脚本文本内容而不是脚本文件的路径）
 * @return {Promise<string>} 输出的内容
 */
export function execShellScriptFile(scriptFile: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable.setEncoding("utf-8");
    readable._read = () => {};
    const handle = spawn("sh", [scriptFile]);
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
      resolve(readable.read());
    });
  });
}
