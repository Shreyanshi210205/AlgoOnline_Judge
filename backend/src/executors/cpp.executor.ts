import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const executeCpp = async (
  code: string,
  input: string,
  submissionId: string
) => {

  const submissionDir = path.join(
    process.cwd(),
    "temp",
    submissionId
  );

  await fs.mkdir(submissionDir, {
    recursive: true,
  });

  const cppFile = path.join(
    submissionDir,
    "main.cpp"
  );

  const exeFile = path.join(
    submissionDir,
    "main"
  );

  const inputFile = path.join(
    submissionDir,
    "input.txt"
  );

  try {

    await fs.writeFile(cppFile, code);

    await fs.writeFile(
      inputFile,
      input
    );

    // Compilation Step
    try {

      await execAsync(
        `docker run --rm -v "${submissionDir}:/app" gcc bash -c "g++ /app/main.cpp -o /app/main"`
      );

    } catch (error: any) {

      await fs.rm(submissionDir, {
        recursive: true,
        force: true,
      });

      return {
        success: false,
        type: "Compilation Error",
        error: error.stderr,
      };
    }

    // Execution Step
    try {
        const start = Date.now();
      const { stdout } =
        await execAsync(
          `docker run --rm --network=none --memory=256m --cpus=1 -v "${submissionDir}:/app" gcc bash -c "/app/main < /app/input.txt"`,
          {
            timeout: 2000,
          }
        );
        const end=Date.now();
      await fs.rm(submissionDir, {
        recursive: true,
        force: true,
      });

      return {
        success: true,
        output: stdout.trim(),
executionTime:
    end - start
        };

    } catch (error: any) {

      await fs.rm(submissionDir, {
        recursive: true,
        force: true,
      });

      if (
        error.killed ||
        error.signal === "SIGTERM"
      ) {
        return {
          success: false,
          type: "Time Limit Exceeded",
        };
      }

      return {
        success: false,
        type: "Runtime Error",
        error: error.stderr || error.message,
      };
    }

  } catch (error: any) {

    await fs.rm(submissionDir, {
      recursive: true,
      force: true,
    });

    return {
      success: false,
      type: "Runtime Error",
      error: error.message,
    };
  }
};