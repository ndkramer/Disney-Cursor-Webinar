/**
 * Slack notifier for Priority 1 cards (Session 3, Step 7).
 *
 * Posts one chat.postMessage per Priority 1 card to the channel configured
 * in .env (SLACK_CHANNEL_ID), authenticated with SLACK_BOT_TOKEN — the same
 * credentials the pre-configured Slack MCP uses, so anything the agent can
 * post to via the MCP, this backend can post to as well.
 *
 * Designed to be safe to call from server.js even when the env is missing:
 *   - If SLACK_BOT_TOKEN or SLACK_CHANNEL_ID is not set, returns
 *     { skipped: true, reason } and the API request still succeeds.
 *   - Network/Slack errors are caught and reported per-card without throwing,
 *     so a single failed card never blocks the rest.
 */

"use strict";

const SLACK_API_URL = "https://slack.com/api/chat.postMessage";

/**
 * Format the Slack message body for a single Priority 1 card.
 * Format matches the spec in Documentation/project-plan.md.
 *
 * @param {{ text: string, assignedTo?: string, dueDate?: string }} card
 * @returns {string}
 */
function formatPriority1Message(card) {
  const title = (card.text || "Untitled").trim();
  const assignedTo = (card.assignedTo || "").trim() || "Unassigned";
  const dueDate = (card.dueDate || "").trim() || "Not set";
  return [
    ":rotating_light: *New Priority 1 card on the Kanban board*",
    "",
    "*Title:*       " + title,
    "*Assigned to:* " + assignedTo,
    "*Due date:*    " + dueDate,
  ].join("\n");
}

/**
 * Send one chat.postMessage. Resolves with the Slack response (or an error
 * descriptor — never throws).
 *
 * @param {string} channelId
 * @param {string} text
 * @param {string} botToken
 * @returns {Promise<{ ok: boolean, ts?: string, error?: string }>}
 */
async function postOne(channelId, text, botToken) {
  try {
    const res = await fetch(SLACK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + botToken,
      },
      body: JSON.stringify({ channel: channelId, text }),
    });
    /** @type {{ ok: boolean, ts?: string, error?: string, warning?: string }} */
    const data = await res.json();
    if (!data.ok) {
      return { ok: false, error: data.error || "unknown_slack_error" };
    }
    return { ok: true, ts: data.ts };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Send one Slack message for every Priority 1 card. Returns an array
 * (one entry per P1 card) describing what was sent.
 *
 * @param {Array<object>} cards
 * @param {{ env?: NodeJS.ProcessEnv }} [opts]
 */
async function notifySlackForPriority1(cards, opts = {}) {
  const env = opts.env || process.env;
  const botToken = env.SLACK_BOT_TOKEN;
  const channelId = env.SLACK_CHANNEL_ID;

  const p1Cards = (Array.isArray(cards) ? cards : []).filter((c) => Number(c?.priority) === 1);
  if (p1Cards.length === 0) {
    return { sent: [], skipped: false };
  }

  if (!botToken || !channelId) {
    const reason =
      !botToken && !channelId
        ? "SLACK_BOT_TOKEN and SLACK_CHANNEL_ID are not set"
        : !botToken
        ? "SLACK_BOT_TOKEN is not set"
        : "SLACK_CHANNEL_ID is not set";
    console.warn(`[notify] Skipping ${p1Cards.length} Priority 1 card(s): ${reason}.`);
    return { sent: [], skipped: true, reason };
  }

  // Fire all P1 messages in parallel; collect per-card outcomes.
  const results = await Promise.all(
    p1Cards.map(async (card) => {
      const outcome = await postOne(channelId, formatPriority1Message(card), botToken);
      if (!outcome.ok) {
        console.error(`[notify] Slack post failed for card "${card.text}": ${outcome.error}`);
      }
      return {
        cardId: card.id,
        title: card.text,
        ok: outcome.ok,
        ts: outcome.ts,
        error: outcome.error,
      };
    })
  );

  return { sent: results, skipped: false };
}

module.exports = {
  notifySlackForPriority1,
  formatPriority1Message,
};
