import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const executeCpp = async (
  code: string,
  input: string
) => {
  const tempDir = path.join(process.cwd(), "temp");

  const cppFile = path.join(
    tempDir,
    "temp.cpp"
  );

  const exeFile = path.join(
    tempDir,
    "temp.exe"
  );

  await fs.writeFile(cppFile, code);

  try {

    await execAsync(
      `g++ "${cppFile}" -o "${exeFile}"`
    );

    const { stdout } =
      await execAsync(
        `echo ${JSON.stringify(input)} | "${exeFile}"`
      );

    return {
      success: true,
      output: stdout.trim(),
    };

  } catch (error: any) {

    return {
      success: false,
      error: error.message,
    };
  }
};