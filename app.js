/**
 * Task list: add tasks, complete, per-task details (Session 1 handout extension).
 * State is in memory only — refresh clears the list.
 */

(function () {
  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const listEl = document.getElementById("task-list");
  const emptyEl = document.getElementById("task-empty");

  const dialogEl = document.getElementById("task-details-dialog");
  const detailForm = document.getElementById("task-details-form");
  const detailTaskId = document.getElementById("detail-task-id");
  const detailDue = document.getElementById("detail-due");
  const detailAssignee = document.getElementById("detail-assignee");
  const detailDescription = document.getElementById("detail-description");
  const detailPriority = document.getElementById("detail-priority");
  const detailCancel = document.getElementById("detail-cancel");

  /** @typedef {{ id: string, text: string, done: boolean, dueDate: string, assignedTo: string, description: string, priority: string }} Task */

  /** @type {Task[]} */
  let tasks = [];

  /** SVG: “details” / list icon for the open-popup control */
  const DETAILS_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>';

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
  }

  function syncEmptyState() {
    const empty = tasks.length === 0;
    emptyEl.hidden = !empty;
    listEl.hidden = empty;
  }

  /** @param {HTMLLabelElement} label @param {Task} task */
  function fillTaskLabel(label, task) {
    label.replaceChildren();
    if (task.done) {
      const strike = document.createElement("s");
      strike.className = "task-item__strike";
      strike.textContent = task.text;
      label.appendChild(strike);
    } else {
      label.appendChild(document.createTextNode(task.text));
    }
  }

  /** @param {Task} task */
  function openDetailsDialog(task) {
    detailTaskId.value = task.id;
    detailDue.value = task.dueDate || "";
    detailAssignee.value = task.assignedTo || "";
    detailDescription.value = task.description || "";
    detailPriority.value = task.priority || "medium";
    dialogEl.showModal();
    detailDue.focus();
  }

  function closeDetailsDialog() {
    dialogEl.close();
  }

  /** @param {string} taskId @returns {Task | undefined} */
  function findTask(taskId) {
    return tasks.find((t) => t.id === taskId);
  }

  detailCancel.addEventListener("click", closeDetailsDialog);

  dialogEl.addEventListener("click", (e) => {
    if (e.target === dialogEl) closeDetailsDialog();
  });

  detailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = findTask(detailTaskId.value);
    if (!task) {
      closeDetailsDialog();
      return;
    }
    task.dueDate = detailDue.value.trim();
    task.assignedTo = detailAssignee.value.trim();
    task.description = detailDescription.value.trim();
    task.priority = detailPriority.value || "medium";
    closeDetailsDialog();
    render();
  });

  function render() {
    listEl.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " task-item--done" : "");
      li.dataset.id = task.id;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "task-item__check";
      cb.checked = task.done;
      cb.setAttribute("aria-label", "Mark complete: " + task.text);

      const middle = document.createElement("div");
      middle.className = "task-item__middle";

      const titleRow = document.createElement("div");
      titleRow.className = "task-item__title-row";

      const label = document.createElement("label");
      label.className = "task-item__label";
      label.htmlFor = "task-" + task.id;
      fillTaskLabel(label, task);

      const assigneeEl = document.createElement("span");
      assigneeEl.className = "task-item__assignee";
      const name = task.assignedTo && task.assignedTo.trim();
      if (name) {
        assigneeEl.textContent = " · " + name;
      }

      titleRow.append(label, assigneeEl);
      middle.appendChild(titleRow);

      cb.id = "task-" + task.id;

      cb.addEventListener("change", () => {
        task.done = cb.checked;
        li.classList.toggle("task-item--done", task.done);
        fillTaskLabel(label, task);
      });

      const detailsBtn = document.createElement("button");
      detailsBtn.type = "button";
      detailsBtn.className = "task-item__details-btn";
      detailsBtn.setAttribute("aria-label", "Edit details for: " + task.text);
      detailsBtn.innerHTML = DETAILS_ICON;
      detailsBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openDetailsDialog(task);
      });

      li.append(cb, middle, detailsBtn);
      listEl.appendChild(li);
    });
    syncEmptyState();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({
      id: uid(),
      text,
      done: false,
      dueDate: "",
      assignedTo: "",
      description: "",
      priority: "medium",
    });
    input.value = "";
    input.focus();
    render();
  });

  syncEmptyState();
})();
