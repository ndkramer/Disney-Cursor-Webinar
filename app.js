/**
 * Kanban board (Session 2 conversion).
 *
 * Cards are grouped into three columns: To Do, In Progress, Done.
 * Each card is draggable between columns via the native HTML5 DnD API.
 *
 * State lives in localStorage under STORAGE_KEY. On first load (or after a
 * "Reset board" click) we hydrate from cards.json. If the page is opened
 * directly off disk and fetch fails, we fall back to an inline seed so the
 * demo still works.
 *
 * Priority is numeric per the new-kanban-card skill:
 *   1 = High (red), 2 = Medium (yellow), 3 = Low (green).
 */

(function () {
  /** @typedef {"todo" | "in-progress" | "done"} Column */
  /** @typedef {1 | 2 | 3} Priority */
  /** @typedef {{
   *   id: string,
   *   text: string,
   *   done: boolean,
   *   dueDate: string,
   *   assignedTo: string,
   *   description: string,
   *   priority: Priority,
   *   column: Column
   * }} Card
   */

  const STORAGE_KEY = "kanban-cards-v1";
  const COLUMNS = /** @type {Column[]} */ (["todo", "in-progress", "done"]);
  const DEFAULT_PRIORITY = /** @type {Priority} */ (2);

  // Inline fallback used only when both localStorage and fetch are unavailable
  // (e.g., opening index.html directly off disk with file:// URLs).
  /** @type {Card[]} */
  const FALLBACK_SEED = [
    {
      id: "60c12586-048e-4825-b773-3bf059d34136",
      text: "Update park navigation system",
      done: false,
      dueDate: "2026-04-24",
      assignedTo: "Nick",
      description: "Update the Park navigation system",
      priority: 1,
      column: "todo",
    },
  ];

  // ------- DOM references -------

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const resetBtn = document.getElementById("reset-board");

  // Transcript panel (added in Session 3, Step 6).
  const transcriptPanel = document.getElementById("transcript-panel");
  const transcriptPicker = document.getElementById("transcript-picker");
  const transcriptLoadBtn = document.getElementById("transcript-load");
  const transcriptText = document.getElementById("transcript-text");
  const transcriptRunBtn = document.getElementById("transcript-run");
  const transcriptStatus = document.getElementById("transcript-status");

  /** @type {Record<Column, HTMLUListElement>} */
  const listEls = {
    todo: document.querySelector('[data-column-list="todo"]'),
    "in-progress": document.querySelector('[data-column-list="in-progress"]'),
    done: document.querySelector('[data-column-list="done"]'),
  };

  /** @type {Record<Column, HTMLElement>} */
  const emptyEls = {
    todo: document.querySelector('[data-column-empty="todo"]'),
    "in-progress": document.querySelector('[data-column-empty="in-progress"]'),
    done: document.querySelector('[data-column-empty="done"]'),
  };

  /** @type {Record<Column, HTMLElement>} */
  const countEls = {
    todo: document.querySelector('[data-column-count="todo"]'),
    "in-progress": document.querySelector('[data-column-count="in-progress"]'),
    done: document.querySelector('[data-column-count="done"]'),
  };

  const dialogEl = document.getElementById("task-details-dialog");
  const detailForm = document.getElementById("task-details-form");
  const detailTaskId = document.getElementById("detail-task-id");
  const detailDue = document.getElementById("detail-due");
  const detailAssignee = document.getElementById("detail-assignee");
  const detailDescription = document.getElementById("detail-description");
  const detailPriority = document.getElementById("detail-priority");
  const detailCancel = document.getElementById("detail-cancel");

  /** SVG: kebab "details" icon for the open-popup control */
  const DETAILS_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>';

  // ------- State -------

  /** @type {Card[]} */
  let cards = [];

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
  }

  /** Coerce arbitrary input into a valid Priority value. */
  function normalizePriority(value) {
    const n = Number(value);
    if (n === 1 || n === 2 || n === 3) return /** @type {Priority} */ (n);
    return DEFAULT_PRIORITY;
  }

  /** Coerce arbitrary input into a valid Column value. */
  function normalizeColumn(value) {
    return COLUMNS.includes(value) ? value : "todo";
  }

  /** Sanitize a raw card-shaped object so we never render bad data. */
  function normalizeCard(raw) {
    return {
      id: typeof raw.id === "string" && raw.id ? raw.id : uid(),
      text: String(raw.text ?? raw.title ?? "").trim(),
      done: Boolean(raw.done),
      dueDate: String(raw.dueDate ?? "").trim(),
      assignedTo: String(raw.assignedTo ?? "").trim(),
      description: String(raw.description ?? "").trim(),
      priority: normalizePriority(raw.priority),
      column: normalizeColumn(raw.column),
    };
  }

  // ------- Persistence -------

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (_) {
      // localStorage may be unavailable (private mode, quota); ignore.
    }
  }

  /** Try localStorage first, then cards.json, then the inline fallback. */
  async function hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= 0) {
          cards = parsed.map(normalizeCard);
          return;
        }
      }
    } catch (_) {
      // fall through to fetch / fallback
    }

    try {
      const res = await fetch("cards.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.cards) ? data.cards : [];
        // cards.json uses `title`; map into our `text` field via normalizeCard.
        cards = list.map(normalizeCard);
        persist();
        return;
      }
    } catch (_) {
      // fetch can fail under file:// — fall through to fallback
    }

    cards = FALLBACK_SEED.map(normalizeCard);
    persist();
  }

  // ------- Rendering -------

  function syncEmptyAndCounts() {
    COLUMNS.forEach((col) => {
      const count = cards.filter((c) => c.column === col).length;
      countEls[col].textContent = String(count);
      emptyEls[col].hidden = count !== 0;
    });
  }

  /** @param {HTMLLabelElement} label @param {Card} card */
  function fillCardLabel(label, card) {
    label.replaceChildren();
    if (card.done) {
      const strike = document.createElement("s");
      strike.className = "task-item__strike";
      strike.textContent = card.text;
      label.appendChild(strike);
    } else {
      label.appendChild(document.createTextNode(card.text));
    }
  }

  /** Build the <li> for a single card. */
  function buildCardEl(card) {
    const li = document.createElement("li");
    // Card background is color-coded by priority per .cursor/rules/priority-colors.mdc.
    li.className =
      "task-item task-item--priority-" + card.priority +
      (card.done ? " task-item--done" : "");
    li.dataset.id = card.id;
    li.draggable = true;

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "task-item__check";
    cb.checked = card.done;
    cb.id = "task-" + card.id;
    cb.setAttribute("aria-label", "Mark complete: " + card.text);

    const middle = document.createElement("div");
    middle.className = "task-item__middle";

    const titleRow = document.createElement("div");
    titleRow.className = "task-item__title-row";

    const label = document.createElement("label");
    label.className = "task-item__label";
    label.htmlFor = cb.id;
    fillCardLabel(label, card);

    const assigneeEl = document.createElement("span");
    assigneeEl.className = "task-item__assignee";
    if (card.assignedTo) assigneeEl.textContent = " · " + card.assignedTo;

    titleRow.append(label, assigneeEl);
    middle.appendChild(titleRow);

    cb.addEventListener("change", () => {
      card.done = cb.checked;
      li.classList.toggle("task-item--done", card.done);
      fillCardLabel(label, card);
      persist();
    });

    const detailsBtn = document.createElement("button");
    detailsBtn.type = "button";
    detailsBtn.className = "task-item__details-btn";
    detailsBtn.setAttribute("aria-label", "Edit details for: " + card.text);
    detailsBtn.innerHTML = DETAILS_ICON;
    detailsBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openDetailsDialog(card);
    });

    // Drag source: stash the card id in dataTransfer for the drop handler.
    li.addEventListener("dragstart", (ev) => {
      li.classList.add("task-item--dragging");
      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setData("text/plain", card.id);
    });
    li.addEventListener("dragend", () => {
      li.classList.remove("task-item--dragging");
    });

    li.append(cb, middle, detailsBtn);
    return li;
  }

  function render() {
    COLUMNS.forEach((col) => {
      listEls[col].innerHTML = "";
    });
    cards.forEach((card) => {
      listEls[card.column].appendChild(buildCardEl(card));
    });
    syncEmptyAndCounts();
  }

  // ------- Drag and drop (drop targets) -------

  /**
   * Wire each column's <ul> as a drop target. Dropping a card moves it
   * into that column and persists the change.
   */
  function wireDropTargets() {
    COLUMNS.forEach((col) => {
      const list = listEls[col];

      list.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
        list.classList.add("task-list--drop-target");
      });

      list.addEventListener("dragleave", (ev) => {
        // Only clear when leaving the list entirely, not when crossing children.
        if (ev.target === list) {
          list.classList.remove("task-list--drop-target");
        }
      });

      list.addEventListener("drop", (ev) => {
        ev.preventDefault();
        list.classList.remove("task-list--drop-target");
        const cardId = ev.dataTransfer.getData("text/plain");
        if (!cardId) return;
        const card = cards.find((c) => c.id === cardId);
        if (!card || card.column === col) return;
        card.column = col;
        persist();
        render();
      });
    });
  }

  // ------- Details dialog -------

  /** @param {Card} card */
  function openDetailsDialog(card) {
    detailTaskId.value = card.id;
    detailDue.value = card.dueDate || "";
    detailAssignee.value = card.assignedTo || "";
    detailDescription.value = card.description || "";
    detailPriority.value = String(card.priority || DEFAULT_PRIORITY);
    dialogEl.showModal();
    detailDue.focus();
  }

  function closeDetailsDialog() {
    dialogEl.close();
  }

  /** @param {string} cardId */
  function findCard(cardId) {
    return cards.find((c) => c.id === cardId);
  }

  detailCancel.addEventListener("click", closeDetailsDialog);

  dialogEl.addEventListener("click", (e) => {
    if (e.target === dialogEl) closeDetailsDialog();
  });

  detailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const card = findCard(detailTaskId.value);
    if (!card) {
      closeDetailsDialog();
      return;
    }
    card.dueDate = detailDue.value.trim();
    card.assignedTo = detailAssignee.value.trim();
    card.description = detailDescription.value.trim();
    card.priority = normalizePriority(detailPriority.value);
    closeDetailsDialog();
    persist();
    render();
  });

  // ------- New card form -------

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    cards.push({
      id: uid(),
      text,
      done: false,
      dueDate: "",
      assignedTo: "",
      description: "",
      priority: DEFAULT_PRIORITY,
      column: "todo", // project rule: new cards always default to To Do
    });
    input.value = "";
    input.focus();
    persist();
    render();
  });

  // ------- Transcript automation (Session 3, Step 6) -------

  /**
   * Set the small status line under the textarea. Pass `kind` to color it:
   * "info" (default), "success", or "error".
   */
  function setTranscriptStatus(message, kind = "info") {
    if (!transcriptStatus) return;
    transcriptStatus.textContent = message || "";
    transcriptStatus.dataset.kind = kind;
  }

  /** Populate the sample-transcript dropdown from GET /api/transcripts. */
  async function loadTranscriptList() {
    if (!transcriptPicker) return;
    try {
      const res = await fetch("/api/transcripts", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const list = Array.isArray(data?.transcripts) ? data.transcripts : [];
      transcriptPicker.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = list.length ? "Choose a sample…" : "No samples found";
      transcriptPicker.appendChild(placeholder);
      list.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t.name;
        opt.textContent = t.name;
        transcriptPicker.appendChild(opt);
      });
    } catch (err) {
      // Likely opened off file:// without the server running. Hide the picker
      // gracefully so the textarea still works for paste-only flow.
      transcriptPicker.replaceChildren();
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Server offline — paste transcript below";
      transcriptPicker.appendChild(opt);
      transcriptPicker.disabled = true;
      if (transcriptLoadBtn) transcriptLoadBtn.disabled = true;
    }
  }

  /** Fetch the selected sample transcript and drop it into the textarea. */
  async function handleTranscriptLoad() {
    if (!transcriptPicker || !transcriptText) return;
    const name = transcriptPicker.value;
    if (!name) {
      setTranscriptStatus("Pick a sample transcript first.", "error");
      return;
    }
    setTranscriptStatus("Loading " + name + "…");
    try {
      const res = await fetch("/api/transcripts/" + encodeURIComponent(name), { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      transcriptText.value = await res.text();
      setTranscriptStatus("Loaded " + name + ". Click Run automation to extract cards.", "success");
    } catch (err) {
      setTranscriptStatus("Could not load " + name + ": " + (err?.message || err), "error");
    }
  }

  /**
   * POST the transcript text to the server, merge the returned cards into the
   * in-memory state (same persistence path as the add-card form), and re-render.
   * cards.json is intentionally not modified — see server.js for why.
   */
  async function handleTranscriptRun() {
    if (!transcriptText) return;
    const text = transcriptText.value.trim();
    if (!text) {
      setTranscriptStatus("Paste a transcript or load a sample first.", "error");
      return;
    }
    if (transcriptRunBtn) transcriptRunBtn.disabled = true;
    setTranscriptStatus("Extracting action items…");
    try {
      const res = await fetch("/api/process-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "HTTP " + res.status);
      }
      const data = await res.json();
      const newCards = Array.isArray(data?.cards) ? data.cards.map(normalizeCard) : [];
      if (!newCards.length) {
        setTranscriptStatus("No action items detected. Try a different transcript.", "error");
        return;
      }
      cards.push(...newCards);
      persist();
      render();

      // Build a status line that also reports Slack outcomes for Priority 1 cards.
      const cardsMsg =
        "Added " + newCards.length + " card" + (newCards.length === 1 ? "" : "s") + " to the board.";
      const notified = Array.isArray(data?.notified) ? data.notified : [];
      const sentOk = notified.filter((n) => n?.ok).length;
      const sentFail = notified.length - sentOk;
      let slackMsg = "";
      if (data?.slackSkipped) {
        slackMsg = " Slack notifications skipped: " + (data.slackSkipReason || "missing config") + ".";
      } else if (notified.length > 0) {
        slackMsg = " Slack: " + sentOk + " Priority 1 alert" + (sentOk === 1 ? "" : "s") + " sent" +
          (sentFail ? ", " + sentFail + " failed" : "") + ".";
      }
      setTranscriptStatus(cardsMsg + slackMsg, sentFail ? "error" : "success");
    } catch (err) {
      setTranscriptStatus("Run failed: " + (err?.message || err), "error");
    } finally {
      if (transcriptRunBtn) transcriptRunBtn.disabled = false;
    }
  }

  if (transcriptLoadBtn) transcriptLoadBtn.addEventListener("click", handleTranscriptLoad);
  if (transcriptRunBtn) transcriptRunBtn.addEventListener("click", handleTranscriptRun);
  // Auto-fetch the sample list once the panel is opened (first time only).
  if (transcriptPanel) {
    transcriptPanel.addEventListener(
      "toggle",
      () => {
        if (transcriptPanel.open) loadTranscriptList();
      },
      { once: true }
    );
  }

  // ------- Reset board -------

  resetBtn.addEventListener("click", async () => {
    const ok = window.confirm(
      "Clear the board and reseed from cards.json? This wipes any drag/edit changes you've made."
    );
    if (!ok) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // ignore
    }
    await hydrate();
    render();
  });

  // ------- Boot -------

  wireDropTargets();
  hydrate().then(render);
})();
