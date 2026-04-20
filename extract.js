/**
 * Regex / heuristic action-item extractor.
 *
 * Pure function: takes a meeting transcript (markdown or plain text) and
 * returns an array of card objects matching the shape used by app.js.
 *
 * No LLM is involved (per the design choice locked in Documentation/project-plan.md).
 * Rules implemented:
 *   - Action-item detection: lines that look like TODOs (bulleted/numbered
 *     lines, ACTION: / TODO: prefixes, or sentences with a name + verb of
 *     intent: "will", "should", "needs to", "is going to", "is working on",
 *     "finished", "completed").
 *   - Priority assignment (urgency-based, per the Session 3 handout):
 *       1 (red)    -> "urgent", "asap", "critical", "today", "blocker",
 *                     "safety", "guest impact", "p1", "priority 1"
 *       3 (green)  -> "nice to have", "when you get a chance",
 *                     "low priority", "p3", or due date >14 days out
 *       2 (yellow) -> default
 *   - Column routing:
 *       in-progress -> "is working on", "is doing", "currently", "in progress"
 *       done        -> "finished", "completed", "shipped", "wrapped up", "done"
 *       todo        -> default (project-context rule: new cards default to To Do)
 *   - Assignee detection: "Name will/should/needs to..." or
 *     "@Name", "Action: Name -" patterns.
 *   - Due date detection: "by Friday", "by 4/24", ISO dates (YYYY-MM-DD),
 *     "tomorrow", "today". Returned as YYYY-MM-DD when resolvable.
 */

"use strict";

const PRIORITY_1_PATTERNS = [
  /\burgent\b/i,
  /\basap\b/i,
  /\bcritical\b/i,
  /\bblocker\b/i,
  /\bsafety\b/i,
  /\bguest[- ]impact\b/i,
  /\bguest impact(ing)?\b/i,
  /\bp1\b/i,
  /\bpriority[- ]?1\b/i,
  /\bemergenc(y|ies)\b/i,
  /\bimmediately\b/i,
  /\bby (end of )?today\b/i,
  /\beod\b/i,
];

const PRIORITY_3_PATTERNS = [
  /\bnice to have\b/i,
  /\bwhen you (get a chance|have time)\b/i,
  /\blow[- ]priority\b/i,
  /\bp3\b/i,
  /\bpriority[- ]?3\b/i,
  /\beventually\b/i,
  /\bbacklog\b/i,
  /\bsomeday\b/i,
];

const COLUMN_IN_PROGRESS_PATTERNS = [
  /\bis working on\b/i,
  /\bis doing\b/i,
  /\bcurrently\s+\w+ing\b/i,
  /\b(?:i['’]?m|we['’]?re|they['’]?re|i am|we are|they are)\s+\w+ing\b/i,
  /\bin[- ]progress\b/i,
  /\bstarted (on|working)\b/i,
  /\bwip\b/i,
];

// Future-tense markers that, if present, mean a "completed/finished/done" word
// in the same sentence is actually a *commitment* ("will be done by tomorrow")
// rather than a real DONE state.
const FUTURE_INTENT_PATTERNS = [
  /\b(?:i['’]?ll|we['’]?ll|will|going to|gonna|planning to)\b/i,
  /\bby (?:tomorrow|today|eod|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next\b)/i,
  /\bby (?:the )?(?:end of (?:today|day|week|tomorrow))\b/i,
  /\bby \d/i, // "by 4/24", "by 2026-04-30"
];

const COLUMN_DONE_PATTERNS = [
  /\bfinished\b/i,
  /\bcompleted\b/i,
  /\bshipped\b/i,
  /\bwrapped (up|it up)\b/i,
  /\bclosed out\b/i,
  /\bis done\b/i,
  /\bdone\b/i,
];

const ACTION_VERB_PATTERNS = [
  /\bwill\b/i,
  /\bshould\b/i,
  /\bneeds to\b/i,
  /\bneed to\b/i,
  /\bis going to\b/i,
  /\bgoing to\b/i,
  /\bplease\b/i,
  /\bmake sure\b/i,
  /\bfollow up\b/i,
  /\bfollow-up\b/i,
];

const ACTION_PREFIX_RE = /^(?:[-*]\s+|\d+[.)]\s+)?(?:(?:action|todo|task|action item|next step|follow[- ]up)\s*:?\s*)/i;
const SPEAKER_PREFIX_RE = /^([A-Z][a-zA-Z'.-]+(?:\s+[A-Z][a-zA-Z'.-]+)?)(?:\s*\([^)]*\))?\s*:\s*(.+)$/;
const NAME_VERB_RE = /\b([A-Z][a-zA-Z'.-]+(?:\s+[A-Z][a-zA-Z'.-]+)?)\s+(?:will|should|needs to|is going to|is working on|is doing|finished|completed|owns?|to)\b/;
const AT_MENTION_RE = /@([A-Z][a-zA-Z'.-]+)/;
// First-person commitment: "I'll fix...", "I'm working on...", "I will do...", "I need to..."
const FIRST_PERSON_RE = /\bI(?:'ll|'m|\s+will|\s+am|\s+can|\s+need|\s+should|\s+have|\s+got|\s+plan)\b/i;

const STOP_NAMES = new Set([
  "We", "They", "I", "You", "He", "She", "It", "Our", "The",
  "Mickey", "Minnie", "Donald", "Goofy", // park "names" we don't want to mistake for assignees
]);

const DOW_TO_OFFSET = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

function uid() {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  // Fallback: not cryptographically strong but unique enough for a demo card id.
  return "card-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

/** Format a Date as YYYY-MM-DD using local time (matches the <input type=date> contract). */
function isoDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Try to resolve a due date phrase to YYYY-MM-DD, relative to `now`. */
function resolveDueDate(text, now = new Date()) {
  const lower = text.toLowerCase();

  // ISO date wins if present.
  const iso = lower.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  if (iso) {
    const y = Number(iso[1]);
    const m = Number(iso[2]);
    const d = Number(iso[3]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  // M/D or M/D/YYYY (assume current year if year omitted).
  const slash = lower.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (slash) {
    const m = Number(slash[1]);
    const d = Number(slash[2]);
    let y = slash[3] ? Number(slash[3]) : now.getFullYear();
    if (y < 100) y += 2000;
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  if (/\btoday\b/.test(lower) || /\beod\b/.test(lower)) {
    return isoDate(now);
  }
  if (/\btomorrow\b/.test(lower)) {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    return isoDate(t);
  }

  // "by Friday", "next Friday", "this Friday".
  const dow = lower.match(/\b(?:by |on |this |next )?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
  if (dow) {
    const target = DOW_TO_OFFSET[dow[1]];
    const today = now.getDay();
    let delta = (target - today + 7) % 7;
    if (delta === 0) delta = 7; // a bare day-of-week means the *next* one
    if (/\bnext\b/.test(lower)) delta += 7;
    const d = new Date(now);
    d.setDate(d.getDate() + delta);
    return isoDate(d);
  }

  // "in N days/weeks".
  const inN = lower.match(/\bin (\d+)\s+(day|week)s?\b/);
  if (inN) {
    const n = Number(inN[1]);
    const days = inN[2] === "week" ? n * 7 : n;
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return isoDate(d);
  }

  return "";
}

/** Pick the assignee for a sentence, given the speaker (if any). */
function detectAssignee(sentence, speaker) {
  const at = sentence.match(AT_MENTION_RE);
  if (at && !STOP_NAMES.has(at[1])) return at[1];

  // Direct address: "Jamal, can you make sure..." -> Jamal.
  const direct = sentence.match(/\b([A-Z][a-zA-Z'.-]+),\s+(?:can|could|will|would|please)\s+you\b/);
  if (direct && !STOP_NAMES.has(direct[1])) return direct[1];

  const nv = sentence.match(NAME_VERB_RE);
  if (nv && !STOP_NAMES.has(nv[1].split(" ")[0])) return nv[1];

  // First-person commitment from the speaker => attribute to speaker.
  if (speaker && /\bi(?:['’]ll|['’]m|\s+will|\s+can|\s+should|\s+need|\s+am|\s+have)\b/i.test(sentence)) {
    return speaker;
  }
  return "";
}

/**
 * Decide priority. P1 is checked on the chosen action sentence (so urgency
 * for one item doesn't bleed onto a different one in the same turn). P3
 * downgrade hints (eventually / backlog / nice-to-have) are checked on the
 * full body too — they often live in a follow-up sentence.
 */
function detectPriority(sentence, dueDate, body, now = new Date()) {
  if (matchesP1(sentence)) return 1;
  for (const re of PRIORITY_3_PATTERNS) {
    if (re.test(sentence)) return 3;
  }
  if (body && body !== sentence) {
    for (const re of PRIORITY_3_PATTERNS) {
      if (re.test(body)) return 3;
    }
  }
  if (dueDate) {
    const due = new Date(dueDate + "T00:00:00");
    const diffDays = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 14) return 3;
  }
  return 2;
}

/**
 * Decide column. Order matters:
 *   1. In-progress wins over done so "I'm working on X — should be done by
 *      tomorrow" lands as in-progress.
 *   2. A "done/finished/completed" word combined with a future-intent marker
 *      ("I'll make sure the swap is completed by tomorrow") is a commitment,
 *      not a real DONE state — fall through to todo.
 */
function detectColumn(sentence) {
  for (const re of COLUMN_IN_PROGRESS_PATTERNS) {
    if (re.test(sentence)) return "in-progress";
  }
  const hasDone = COLUMN_DONE_PATTERNS.some((re) => re.test(sentence));
  const hasFutureIntent = FUTURE_INTENT_PATTERNS.some((re) => re.test(sentence));
  if (hasDone && !hasFutureIntent) return "done";
  return "todo";
}

/**
 * Strip leading speaker/list/action prefixes off a line and return
 * { speaker, body } where body is the meaningful sentence.
 */
function stripPrefixes(rawLine) {
  let line = rawLine.replace(/\s+/g, " ").trim();
  if (!line) return { speaker: "", body: "" };

  let speaker = "";
  const sp = line.match(SPEAKER_PREFIX_RE);
  if (sp) {
    speaker = sp[1];
    line = sp[2].trim();
  }

  // Strip bullet/number markers and ACTION:/TODO: tags.
  line = line.replace(ACTION_PREFIX_RE, "").trim();

  return { speaker, body: line };
}

/** True if `pattern` matches `text` and the match is not directly negated. */
function hasUnnegated(text, pattern) {
  const m = text.match(pattern);
  if (!m || m.index == null) return false;
  const before = text.slice(Math.max(0, m.index - 18), m.index);
  return !/\b(?:not|no|never|isn['’]?t|wasn['’]?t|aren['’]?t|won['’]?t|don['’]?t|doesn['’]?t)\s*$/i.test(before);
}

/** True if any P1 pattern matches and isn't negated ("not urgent"). */
function matchesP1(text) {
  return PRIORITY_1_PATTERNS.some((re) => hasUnnegated(text, re));
}

/** Score how "action-y" a sentence is. Higher = more likely to be a real card. */
function actionScore(sentence) {
  let score = 0;
  if (AT_MENTION_RE.test(sentence)) score += 3;
  if (NAME_VERB_RE.test(sentence)) score += 3;
  if (FIRST_PERSON_RE.test(sentence)) score += 3; // first-person commitment
  for (const re of ACTION_VERB_PATTERNS) {
    if (re.test(sentence)) {
      score += 1;
      break; // any one verb is enough; don't double-count
    }
  }
  // Urgency boost: sentences flagged as P1 are inherently action-y, even if
  // the verb is implicit ("Marcus, this is a blocker."). Skip when negated.
  if (matchesP1(sentence)) score += 2;
  // Length bonus: a 5-word ack ("Will do.") shouldn't beat a real sentence.
  const words = sentence.split(/\s+/).filter(Boolean).length;
  if (words >= 6) score += 1;
  if (words >= 12) score += 1;
  // Penalize meta-acknowledgements that have no specifics.
  if (/^(yeah|yep|yes|ok|okay|got it|sure|right|great|thanks|will do|confirmed|understood|noted)\b/i.test(sentence)) {
    score -= 3;
  }
  return score;
}

// Abbreviations that end with a period but should NOT terminate a sentence.
const ABBREVIATIONS = [
  "St", "Mr", "Mrs", "Ms", "Dr", "Sr", "Jr", "Prof",
  "vs", "etc", "e.g", "i.e", "U.S", "U.K",
];
const ABBREV_RE = new RegExp("\\b(" + ABBREVIATIONS.join("|") + ")\\.", "g");

/** Split a body into trimmed sentences (always returns at least one entry). */
function splitSentences(body) {
  // Mask abbreviations so the split below doesn't fire on "St. Thomas" etc.
  const MASK = "\u0001";
  const masked = body.replace(ABBREV_RE, (_m, ab) => ab + MASK);
  const parts = masked
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(new RegExp(MASK, "g"), ".").trim())
    .filter(Boolean);
  return parts.length ? parts : [body];
}

/**
 * Pick the best sentence within a multi-sentence body and return both it and
 * its score, so the caller can decide whether the body is action-y enough.
 */
function pickActionSentence(body) {
  const sentences = splitSentences(body);
  let best = sentences[0];
  let bestScore = actionScore(best);
  for (let i = 1; i < sentences.length; i++) {
    const s = sentences[i];
    const sc = actionScore(s);
    if (sc > bestScore) {
      best = s;
      bestScore = sc;
    }
  }
  return { sentence: best, score: bestScore };
}

/**
 * Heuristic gate: does this line describe an action item worth capturing?
 * Uses the best per-sentence score so that a leading ack ("Yeah, urgent...")
 * doesn't drag a real action-y sentence below threshold.
 */
function looksLikeAction(line, hadActionPrefix) {
  if (!line) return false;
  if (hadActionPrefix) return true;
  return pickActionSentence(line).score >= 3;
}

/** Truncate a long sentence into a card title (~80 chars, on a word boundary). */
function makeTitle(sentence, maxLen = 80) {
  const flat = sentence.replace(/\s+/g, " ").trim();
  if (flat.length <= maxLen) return flat;
  const cut = flat.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-]+$/, "") + "…";
}

/**
 * Extract card-shaped objects from a transcript string.
 *
 * @param {string} transcript Raw transcript text (markdown or plain).
 * @param {{ now?: Date }} [opts]
 * @returns {Array<{
 *   id: string, text: string, done: boolean, dueDate: string,
 *   assignedTo: string, description: string, priority: 1|2|3,
 *   column: "todo"|"in-progress"|"done"
 * }>}
 */
function extractActionItems(transcript, opts = {}) {
  const now = opts.now instanceof Date ? opts.now : new Date();
  if (typeof transcript !== "string" || !transcript.trim()) return [];

  // Drop markdown headings and horizontal rules so they don't pollute matching.
  const rawLines = transcript
    .split(/\r?\n/)
    .map((l) => l.replace(/^#+\s*/, "").replace(/^---+$/, ""));

  /** @type {ReturnType<typeof extractActionItems>} */
  const cards = [];
  const seen = new Set(); // dedupe identical action sentences

  for (const raw of rawLines) {
    const hadActionPrefix = ACTION_PREFIX_RE.test(raw.trim());
    const { speaker, body } = stripPrefixes(raw);
    if (!body) continue;
    if (!looksLikeAction(body, hadActionPrefix)) continue;

    // Pick the sentence within this turn that looks most like the actual action,
    // not just the first sentence (which is often a preamble like "F&B update.").
    const picked = pickActionSentence(body);
    const sentence = picked.sentence;
    // Skip turns where even the best sentence is a throwaway ack with no detail,
    // unless an explicit ACTION:/TODO: prefix forces it through.
    if (!hadActionPrefix && picked.score < 3) continue;
    const key = sentence.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    // Score column/priority/due-date off the chosen action sentence so a later
    // sentence's "done" / "urgent" doesn't bleed into a different action.
    const dueDate = resolveDueDate(sentence, now) || resolveDueDate(body, now);
    const priority = detectPriority(sentence, dueDate, body, now);
    const column = detectColumn(sentence);
    const assignedTo = detectAssignee(sentence, speaker) || detectAssignee(body, speaker);

    cards.push({
      id: uid(),
      text: makeTitle(sentence),
      done: column === "done",
      dueDate,
      assignedTo,
      description: body,
      priority,
      column,
    });
  }

  return cards;
}

module.exports = {
  extractActionItems,
  // Exported for unit testing / inspection only.
  _internals: {
    resolveDueDate,
    detectPriority,
    detectColumn,
    detectAssignee,
    stripPrefixes,
    looksLikeAction,
    makeTitle,
  },
};
