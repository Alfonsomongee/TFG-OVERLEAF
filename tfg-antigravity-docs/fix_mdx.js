const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Find all MDX files
const files = glob.sync("**/*.mdx", {
  cwd: __dirname,
  ignore: ["node_modules/**", ".docusaurus/**", "build/**"],
});

console.log("Found MDX files:", files.length);

// Analyze each file for problematic patterns
files.forEach((file) => {
  const filePath = path.join(__dirname, file);
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  let inDollarBlock = false;
  let inFrontmatter = false;
  let frontmatterDone = false;
  let issues = [];

  lines.forEach((line, i) => {
    // Handle frontmatter
    if (i === 0 && line.trim() === "---") {
      inFrontmatter = true;
      return;
    }
    if (inFrontmatter && line.trim() === "---") {
      inFrontmatter = false;
      frontmatterDone = true;
      return;
    }
    if (inFrontmatter) return;

    // Track $$ blocks
    const ddCount = (line.match(/\$\$/g) || []).length;
    if (ddCount % 2 !== 0) inDollarBlock = !inDollarBlock;
    if (inDollarBlock) return;

    // Strip inline math
    let stripped = line.replace(/\$[^$\n]+\$/g, "INLINEMATH");

    // Find remaining braces (outside math)
    const m = stripped.match(/\{[^}]+\}/g);
    if (m) {
      m.forEach((match) => {
        // Skip known good JSX patterns
        if (match.includes("@site") || match.includes("GlossaryLink") || match.includes("BiblioCard") || match.includes("import ") || match.includes("/*")) return;
        // These are the problematic ones
        issues.push({ line: i + 1, match, context: line.substring(0, 100) });
      });
    }
  });

  if (issues.length > 0) {
    console.log("\n=== " + file + " ===");
    issues.forEach((issue) => {
      console.log("  Line " + issue.line + ": " + issue.match + " | " + issue.context);
    });
  }
});
