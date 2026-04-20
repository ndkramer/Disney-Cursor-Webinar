/**
 * Tiny local backend for the Kanban board.
 *
 * Responsibilities:
 *   - Serve the existing static files (index.html / app.js / styles.css /
 *     cards.json) from the project root, so the page is reachable at
 *     http://localhost:5174/ instead of opening index.html off disk.
 *   - Expose three JSON endpoints used by the new "Process transcript" panel:
 *       GET  /api/transcripts            -> [{ name, path }]
 *       GET  /api/transcripts/:filename  -> raw transcript text/plain
 *       POST /api/process-transcript     -> { cards, notified }
 *
 * Notifications: each Priority 1 card produced by /api/process-transcript
 * triggers a Slack chat.postMessage via notify.js. The response includes a
 * `notified` array describing which messages went out (or why they were
 * skipped).
 *
 * cards.json: per the project plan, this server intentionally does NOT modify
 * cards.json. Extracted cards are returned to the browser, which merges them
 * into in-memory state + localStorage (same path as the existing add-card
 * form). cards.json stays as the seed for "Reset board".
 */

"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");

const { extractActionItems } = require("./extract.js");
const { notifySlackForPriority1 } = require("./notify.js");

const PROJECT_ROOT = __dirname;
const TRANSCRIPTS_DIR = path.join(PROJECT_ROOT, "Transcripts");
const PORT = Number(process.env.PORT) || 5174;
const ALLOWED_TRANSCRIPT_EXT = new Set([".md", ".txt"]);

const app = express();
app.use(express.json({ limit: "1mb" }));

// Static site: serve the existing HTML/CSS/JS/JSON from the project root.
// Keep this AFTER any /api routes we don't want shadowed; here it's safe
// because everything under /api/* is registered below.
app.use(express.static(PROJECT_ROOT, { extensions: ["html"] }));

/** Reject any filename that tries to escape Transcripts/ or has the wrong extension. */
function safeTranscriptName(name) {
  if (typeof name !== "string" || !name) return null;
  const base = path.basename(name);
  if (base !== name) return null; // had a slash / traversal
  if (!ALLOWED_TRANSCRIPT_EXT.has(path.extname(base).toLowerCase())) return null;
  return base;
}

app.get("/api/transcripts", (_req, res) => {
  fs.readdir(TRANSCRIPTS_DIR, { withFileTypes: true }, (err, entries) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.json({ transcripts: [] });
      }
      console.error("[transcripts] readdir failed:", err);
      return res.status(500).json({ error: "Failed to list transcripts." });
    }
    const transcripts = entries
      .filter((e) => e.isFile() && ALLOWED_TRANSCRIPT_EXT.has(path.extname(e.name).toLowerCase()))
      .map((e) => ({ name: e.name, path: `Transcripts/${e.name}` }))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json({ transcripts });
  });
});

app.get("/api/transcripts/:filename", (req, res) => {
  const safe = safeTranscriptName(req.params.filename);
  if (!safe) return res.status(400).type("text/plain").send("Invalid filename.");
  const full = path.join(TRANSCRIPTS_DIR, safe);
  fs.readFile(full, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") return res.status(404).type("text/plain").send("Not found.");
      console.error("[transcripts] readFile failed:", err);
      return res.status(500).type("text/plain").send("Failed to read transcript.");
    }
    res.type("text/plain; charset=utf-8").send(data);
  });
});

app.post("/api/process-transcript", async (req, res) => {
  const transcript = typeof req.body?.transcript === "string" ? req.body.transcript : "";
  if (!transcript.trim()) {
    return res.status(400).json({ error: "Body must include non-empty `transcript` string." });
  }
  let cards;
  try {
    cards = extractActionItems(transcript);
  } catch (err) {
    console.error("[process-transcript] extractor threw:", err);
    return res.status(500).json({ error: "Extractor failed." });
  }

  // Fire one Slack message per Priority 1 card. notifySlackForPriority1 never
  // throws — it returns per-card outcomes (and a `skipped` flag if Slack creds
  // are missing), so a failed notification can't block card creation.
  const result = await notifySlackForPriority1(cards);
  res.json({ cards, notified: result.sent, slackSkipped: result.skipped || false, slackSkipReason: result.reason });
});

app.listen(PORT, () => {
  console.log(`Kanban server listening on http://localhost:${PORT}`);
});
