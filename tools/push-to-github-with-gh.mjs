import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const repoName = process.argv[2] || "ppccc-app";
const visibility = process.argv[3] || "private";
const owner = "brandont9713-dev";
const repoFullName = `${owner}/${repoName}`;
const gh = join(process.cwd(), "tools", "gh", "bin", "gh.exe");

const ignoreParts = new Set([
  ".git",
  ".expo",
  ".expo-home",
  ".eas-home",
  "node_modules",
  "tools",
]);

const ignoreNames = new Set([
  ".env",
  ".env.local",
  "server.log",
  "expo.log",
]);

function runGh(args, options = {}) {
  return execFileSync(gh, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: options.stdio || ["ignore", "pipe", "pipe"],
  }).trim();
}

function runGhJson(args) {
  const out = runGh(args);
  return out ? JSON.parse(out) : null;
}

function shouldIgnore(path) {
  const parts = path.split(sep);
  return parts.some((part) => ignoreParts.has(part)) || ignoreNames.has(basename(path));
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(process.cwd(), full);
    if (shouldIgnore(rel)) continue;
    const stats = statSync(full);
    if (stats.isDirectory()) out.push(...walk(full));
    if (stats.isFile()) out.push(rel.replaceAll("\\", "/"));
  }
  return out;
}

function ensureRepo() {
  try {
    runGh(["repo", "view", repoFullName, "--json", "name"]);
    return;
  } catch {
    runGh([
      "api",
      "user/repos",
      "-X",
      "POST",
      "-f",
      `name=${repoName}`,
      "-f",
      `private=${visibility === "private" ? "true" : "false"}`,
      "-f",
      "auto_init=false",
    ]);
  }
}

function getHeadSha() {
  try {
    return runGhJson(["api", `repos/${repoFullName}/git/ref/heads/main`]).object.sha;
  } catch {
    return null;
  }
}

function getCommit(sha) {
  if (!sha) return null;
  return runGhJson(["api", `repos/${repoFullName}/git/commits/${sha}`]);
}

function createBlob(path) {
  const content = readFileSync(path).toString("base64");
  const blob = runGhJson([
    "api",
    `repos/${repoFullName}/git/blobs`,
    "-X",
    "POST",
    "-f",
    `content=${content}`,
    "-f",
    "encoding=base64",
  ]);
  return blob.sha;
}

function main() {
  if (!existsSync(gh)) {
    throw new Error(`GitHub CLI not found at ${gh}`);
  }

  ensureRepo();

  const headSha = getHeadSha();
  const parentCommit = getCommit(headSha);
  const baseTree = parentCommit?.tree?.sha;
  const files = walk(process.cwd());
  const tree = files.map((path) => ({
    path,
    mode: "100644",
    type: "blob",
    sha: createBlob(path),
  }));

  const treeArgs = [
    "api",
    `repos/${repoFullName}/git/trees`,
    "-X",
    "POST",
    "--input",
    "-",
  ];

  const treePayload = baseTree ? { base_tree: baseTree, tree } : { tree };
  const treeResult = JSON.parse(execFileSync(gh, treeArgs, {
    cwd: process.cwd(),
    input: JSON.stringify(treePayload),
    encoding: "utf8",
  }));

  const commitPayload = {
    message: "Prepare PPCCC app for Expo and Supabase testing",
    tree: treeResult.sha,
    parents: headSha ? [headSha] : [],
  };

  const commit = JSON.parse(execFileSync(gh, [
    "api",
    `repos/${repoFullName}/git/commits`,
    "-X",
    "POST",
    "--input",
    "-",
  ], {
    cwd: process.cwd(),
    input: JSON.stringify(commitPayload),
    encoding: "utf8",
  }));

  if (headSha) {
    execFileSync(gh, [
      "api",
      `repos/${repoFullName}/git/refs/heads/main`,
      "-X",
      "PATCH",
      "-f",
      `sha=${commit.sha}`,
    ], { cwd: process.cwd(), stdio: "inherit" });
  } else {
    execFileSync(gh, [
      "api",
      `repos/${repoFullName}/git/refs`,
      "-X",
      "POST",
      "-f",
      "ref=refs/heads/main",
      "-f",
      `sha=${commit.sha}`,
    ], { cwd: process.cwd(), stdio: "inherit" });
  }

  console.log(`Pushed ${files.length} files to https://github.com/${repoFullName}`);
}

main();
