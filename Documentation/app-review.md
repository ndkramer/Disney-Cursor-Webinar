# Kanban Board App — Review Summary

This document summarizes how the app works, in plain English. Originally written for **Session 1** (a flat task list); updated for **Session 2** when the app was upgraded to a **Kanban board** with priority color coding and custom Cursor rules.

## What you have

A small **single-page** web app with **no build step** and **no server-side code**. You open `index.html` (ideally via a local web server such as VS Code Live Server) and everything runs in the browser using **HTML** for structure, **CSS** for layout and appearance, and **JavaScript** for behavior.

## What the user sees and does

1. **A three-column board**
   The page shows a **Kanban board** with three columns:
   - **To Do**
   - **In Progress**
   - **Done**

   Each column has a header with a count badge showing how many cards are in it, and an empty-state message when the column is empty.

2. **Add a card**
   Type text in the box and click **Add card**. A new card always appears in the **To Do** column with default Priority 2 (Medium). This default is enforced by a project rule.

3. **Drag a card between columns**
   Cards are **draggable**. Pick up any card and drop it on another column to move it. The destination column highlights while you hover over it; the card you're dragging goes semi-transparent. Dropping a card on its current column does nothing.

4. **Mark a card complete**
   Each card has a **checkbox**. Checking it shows the title with **strikethrough** and softer coloring. Cards stay in their current column when checked — they don't auto-move to Done.

5. **Edit card details**
   Each card has a **details** button (three-dot icon). Clicking it opens a **popup** (a native HTML `<dialog>`) with:
   - **Due date**
   - **Assigned to** (a name)
   - **Description** (longer notes)
   - **Priority** (`1 — High (Red)`, `2 — Medium (Yellow)`, or `3 — Low (Green)`)

   **Save** writes those fields onto the card, persists them, and updates the card on the board. **Cancel**, clicking the dimmed area outside the dialog, or **Escape** discards changes.

6. **Priority color coding**
   Every card's **background color** reflects its priority:
   - Priority 1 → **soft red**
   - Priority 2 → **soft yellow**
   - Priority 3 → **soft green**

   The color stays with the card as it moves between columns, and updates immediately when you change priority in the details dialog.

7. **Assignee shown on the card**
   If **Assigned to** has a value, the name appears next to the title on the card (gray text after a dot, e.g. ` · Nick`).

8. **Reset board**
   A **Reset board** button in the top-right of the header wipes saved state and reloads the seed data from `cards.json`. Useful for demos.

## How it works under the hood (still plain English)

- **One array of cards**
  The script keeps an array of **card objects**. Each card has: `id`, `text`, `done`, `dueDate`, `assignedTo`, `description`, `priority` (numeric `1|2|3`), and `column` (`"todo" | "in-progress" | "done"`).

- **State is saved to your browser**
  Every change (add, complete, edit, drag) is written to **`localStorage`** under the key `kanban-cards-v1`. **Refreshing the page keeps your cards.**

- **Where the initial cards come from**
  On first load the app tries, in order:
  1. **`localStorage`** — if you've used the app before, your saved state loads.
  2. **`cards.json`** — if `localStorage` is empty, the app fetches the seed file from the project root and saves it to `localStorage`.
  3. **Inline fallback** — if `fetch` fails (for example, opening `index.html` off `file://`), a single seeded card is used so the app still works.

- **Rendering**
  Whenever the data changes, `render()` clears all three column lists and rebuilds them from the cards array, grouped by `column`. Each card's `<li>` gets a `task-item--priority-{1|2|3}` class so its background color matches its priority.

- **Drag and drop**
  Built on the **native HTML5 Drag and Drop API** — no external libraries. Each card sets `draggable="true"` and stashes its `id` in `dataTransfer` on `dragstart`. Each column list is a drop target: it allows the drop, highlights itself on `dragover`, and on `drop` it updates the card's `column` and re-renders.

- **Styling**
  Light gray background, soft pastel cards color-coded by priority, columns laid out in a **3-column responsive grid** that collapses to a single column on narrow screens. Blue primary buttons for **Add card** and **Save**.

## Files in the project

| File | Role |
|------|------|
| `index.html` | Page structure: header (with **Reset board**), add-card form, three-column **board**, per-column empty messages, and the **details dialog** markup. |
| `styles.css` | All visual design: colors, spacing, board grid, column styling, card priority backgrounds, drop-target / dragging states, dialog, buttons. |
| `app.js` | All behavior: card array, hydration from `localStorage`/`cards.json`/inline fallback, `render()` per column, drag-and-drop wiring, dialog handlers, persistence, **Reset board**. |
| `cards.json` | Seed data for the board — used the first time the app loads (or after Reset). |

## Custom Cursor rules and skills

The project's `.cursor/` folder contains AI guidance that shapes how Cursor works on this codebase:

| Path | Type | Purpose |
|------|------|---------|
| `.cursor/rules/project-context.mdc` | Always-on rule | Describes the app and its rules: Kanban board with three columns, "card" terminology, new cards default to To Do. |
| `.cursor/rules/communication.mdc` | Always-on rule | Requires Cursor to explain changes in plain English first, ask for confirmation on large structural changes, and offer three implementation options for new features. |
| `.cursor/rules/priority-colors.mdc` | Always-on rule | Defines the priority color system: Priority 1 = red background, Priority 2 = yellow, Priority 3 = green — applied consistently across the app. |
| `.cursor/skills/new-kanban-card/SKILL.md` | On-demand skill | Triggered when the user asks to add a card. Collects Title, Priority (1/2/3), Assigned To, Due Date, Description; defaults the card to To Do; applies the priority color; confirms before adding. |

## Session alignment

- **Session 1** — Built the original task list app with HTML, CSS, and JavaScript: add, view, complete, and per-task details popup. Still the foundation underneath.
- **Session 2** — Converted the task list into a **Kanban board** with three draggable columns, persistent state via `localStorage`, numeric priority (1/2/3) with color-coded card backgrounds, a project context rule, a communication rule, a priority-color rule, and a `new-kanban-card` skill.

---

*Generated as part of the Disney AI Day / Cursor webinar materials.*
