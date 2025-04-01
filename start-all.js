const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Configure paths to your services
const projectRoot = __dirname;
const frontendDir = path.join(projectRoot, "Frontend");
const loginServerPath = path.join(frontendDir, "login_server.js");

// Verify paths exist
if (!fs.existsSync(frontendDir)) {
  console.error(`Error: Frontend directory not found at ${frontendDir}`);
  process.exit(1);
}

if (!fs.existsSync(loginServerPath)) {
  console.error(`Error: Login server not found at ${loginServerPath}`);
  process.exit(1);
}

// Check if app.py exists
const appPyPath = path.join(projectRoot, "/backend/app.py");
if (!fs.existsSync(appPyPath)) {
  console.error(`Error: Flask app not found at ${appPyPath}`);
  process.exit(1);
}

// Start a service process with colored output
function startService(command, args, cwd, name, color) {
  console.log(`\x1b[${color}m[${name}] Starting...\x1b[0m`);

  const childProcess = spawn(command, args, {
    cwd: cwd,
    shell: true,
    stdio: "pipe",
  });

  childProcess.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`\x1b[${color}m[${name}] ${line}\x1b[0m`);
      }
    });
  });

  childProcess.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`\x1b[${color}m[${name} ERROR] ${line}\x1b[0m`);
      }
    });
  });

  childProcess.on("close", (code) => {
    console.log(
      `\x1b[${color}m[${name}] Process exited with code ${code}\x1b[0m`
    );

    // Restart the process if it crashes
    if (code !== 0) {
      console.log(`\x1b[${color}m[${name}] Restarting in 5 seconds...\x1b[0m`);
      setTimeout(() => {
        startService(command, args, cwd, name, color);
      }, 5000);
    }
  });

  return childProcess;
}

// Start all services
console.log("\x1b[32m%s\x1b[0m", "🚀 Starting all services...");
const pythonProcess = startService(
  "python",
  ["backend/app.py"],
  projectRoot,
  "FLASK API",
  "36"
); // Cyan

// Start frontend service
const frontendProcess = startService(
  "npm",
  ["run", "dev"],
  frontendDir,
  "FRONTEND",
  "33"
); // Yellow

// Start login server
const loginProcess = startService(
  "node",
  ["--experimental-modules", "login_server.js"],
  frontendDir,
  "LOGIN SERVER",
  "35"
); // Magenta

// Handle script termination
process.on("SIGINT", () => {
  console.log("\nShutting down all services...");
  pythonProcess.kill();
  frontendProcess.kill();
  loginProcess.kill();
  process.exit(0);
});

console.log("\x1b[32m%s\x1b[0m", "✅ All services started successfully!");
console.log("\x1b[32m%s\x1b[0m", "🌐 Press Ctrl+C to shut down all services");
