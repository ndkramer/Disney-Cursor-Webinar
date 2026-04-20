# Task List App — Review Summary

This document summarizes how the task list web app works, in plain English. It was written to satisfy **Session 1 Handout** instructions: explain what we built and how it behaves.

## What you have

A small **single-page** web app with **no build step** and **no server**. You open `index.html` in a browser (or use Cursor’s preview). Everything runs in the browser using **HTML** for structure, **CSS** for layout and appearance, and **JavaScript** for behavior.

## What the user sees and does

1. **Add a task**  
   Type text in the box and click **Add task** (or submit the form). A new row appears in **Your tasks**.

2. **See all tasks**  
   Tasks are listed vertically. If there are no tasks, a short message says so and the empty list is hidden until something is added.

3. **Mark a task complete**  
   Each row has a **checkbox**. Checking it marks the task done; unchecking marks it not done. When a task is done, its title is shown with **strikethrough** and softer coloring so it’s visually distinct.

4. **Optional details per task**  
   Each row has a **details** button (three-dot icon). Clicking it opens a **popup** (a native HTML `<dialog>`). There you can set:
   - **Due date**
   - **Assigned to** (a name)
   - **Description** (longer notes)
   - **Priority** (Low, Medium, or High)

   **Save** writes those fields onto that task and closes the popup. **Cancel**, clicking the dimmed area outside the dialog, or **Escape** closes the popup **without** updating the task (anything you typed in the form is thrown away unless you click Save).

5. **Assigned name on the list**  
   If **Assigned to** has a value and you save, the app shows that name **next to the task title** on the main list (as gray text after a dot, e.g. ` · Jamie`).

## How it works under the hood (still plain English)

- **One list in memory**  
  The script keeps an array of **task objects**. Each task has a unique id, the text you typed, whether it’s done, and the optional detail fields (due date, assignee, description, priority).  
  **Important:** Nothing is saved to disk or the cloud. **Refreshing the page clears all tasks.**

- **Drawing the list**  
  Whenever the list changes (new task, checkbox toggled, details saved), the script **clears the list in the page** and **rebuilds** it from the array. That keeps the screen in sync with the data.

- **Checkbox and label**  
  The task title is a **label** tied to its checkbox, so clicking the title toggles the checkbox like a normal form.

- **Details button**  
  The details button does **not** toggle the checkbox. It only opens the dialog for that row’s task.

- **Styling**  
  The page uses a **light gray** background, white cards for the task list, dark text, and **blue** primary buttons (Add task, Save in the dialog). Layout is centered with a comfortable max width on wide screens.

## Files in the project

| File        | Role |
|------------|------|
| `index.html` | Page structure: header, add form, task list area, empty message, and the details **dialog** markup. |
| `styles.css` | All visual design: colors, spacing, list rows, dialog, buttons. |
| `app.js`     | All behavior: the task array, `render()`, form handlers, dialog open/save/close. |

## Session 1 handout alignment

The app matches the core Session 1 idea: **HTML, CSS, and JavaScript** in the browser; **add**, **view**, and **mark complete** tasks. Extra Session 1 steps you implemented include **per-task details in a popup** and **showing assignee on the list** after save.

---

*Generated as part of the Disney AI Day / Cursor webinar materials.*
