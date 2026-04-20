![](extracted-assets/session2/media/image1.png)

# Session 2 Handout: From Task List to Kanban Board

*Disney AI Day \| Intermediate Session \| April 22, 2026*

## What You Will Do

Pick up where Session 1 left off. You will open the task list app you
built, add a project context rule, create a Kanban card Skill, add
custom rules to control how Cursor behaves, and then upgrade the app
into a color-coded priority Kanban board.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>You will need the task list app from Session 1. Open Cursor and load
the task-list-app folder you created in the previous session. If you do
not have it, a copy is available in the shared GitHub repository:</p>
<p>https://github.com/ndkramer/Disney-Cursor-Webinar.git</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 1: Open Your Project from Session 1

1.  Launch Cursor on your computer.

2.  Go to File \> Open Folder and select your task-list-app folder.

3.  Confirm your project files are visible in the Explorer panel.

4.  Open the internal browser and run the app to confirm it is still
    working before making any changes.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Always verify your starting point before building on top of it. A
quick check now saves troubleshooting time later.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 2: Create a Project Context Rule

Rules are always-on instructions that Cursor reads at the start of every
chat. Adding a project context rule means you never have to re-explain
your project - Cursor already knows what it is working with.

5.  In the Agent panel, type the following prompt to have Cursor set up
    the rule for you:

> *"Create a project context rule for this app. Set up the
> .cursor/rules/ folder if it does not exist, and create a file called
> project-context.mdc with the following content: This project is a task
> list web app built with HTML, CSS, and JavaScript. It allows users to
> add tasks, mark them complete, and view task details, including Due
> Date, Assigned To, Description, and Priority. We are upgrading it to a
> Kanban board with three columns: To Do, In Progress, and Done. Always
> refer to tasks as cards. Always default new cards to the To Do
> column."*

6.  Confirm the .cursor/rules/project-context.mdc file appears in the
    Explorer panel.

7.  Open a new Agent chat and ask Cursor a question about the project
    without any additional context. For example:

> *"What are we building and what columns does the board have?"*

8.  Notice that Cursor already knows the answer - it read the rule
    automatically.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Rules live in .cursor/rules/ as .mdc files and are always active for
every chat in that project. Think of them as permanent instructions you
never have to repeat. You can have multiple rule files - one for project
context, one for coding standards, one for visual conventions, and so
on.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 3: Create a New Card Skill

Skills are different from Rules. A Skill is an on-demand workflow the
agent follows when it needs to perform a specific task. Unlike Rules
which are always active, Skills are invoked automatically by Cursor when
it recognizes the task.

For this project, you will create a Skill that defines exactly how a new
Kanban card should be structured every time one is created.

9.  In the Agent panel, type the following prompt to have Cursor set up
    the Skill for you:

> *"Create a new Kanban card Skill for this project. Set up the
> .cursor/skills/new-kanban-card/ folder and create a SKILL.md file with
> the following: name: new-kanban-card, description: Create a new Kanban
> card when a user asks to add a task, create a ticket, or add a card to
> the board. The workflow should always collect Title, Priority (1=red,
> 2=yellow, 3=green), Assigned To, Due Date, and Description. Always
> default the card to the To Do column, apply the correct background
> color based on priority, and confirm with the user before adding the
> card to the board."*

10. Confirm the .cursor/skills/new-kanban-card/SKILL.md file appears in
    the Explorer panel.

11. In the Agent panel, ask Cursor to add a new card:

> *"Add a new card for updating the park navigation system."*

12. Notice that Cursor automatically invokes the new-kanban-card Skill
    and follows the full workflow - it asks for all required fields,
    applies the correct color, and confirms before adding the card to
    the board. You did not need to reference the Skill explicitly -
    Cursor recognized the task and loaded it on its own.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>The key difference between a Rule and a Skill: a Rule is always on,
shaping every interaction. A Skill is invoked automatically by Cursor
when it recognizes the task matches the Skill's description - you never
need to call it explicitly. Rules set the context. Skills define the
workflow.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Rules vs Skills: When to Use Each

|  | **Rules** | **Skills** |
|----|----|----|
| **What it is** | Always-on instructions Cursor reads at the start of every chat | On-demand workflows the agent follows for a specific task |
| **When it applies** | Automatically, on every interaction | Automatically, when Cursor recognizes the task matches the Skill description |
| **Best for** | Project context, coding standards, communication preferences, visual conventions | Step-by-step workflows, repeatable processes, domain-specific tasks Cursor can recognize and invoke on its own |
| **Stored in** | .cursor/rules/ as .mdc files | .cursor/skills/ as SKILL.md files |
| **Scope** | Shapes all interactions in the project | Triggered for a specific type of task |
| **Example** | "Always explain changes in plain English before making them" | "When creating a new card, collect Title, Priority, Assigned To, Due Date, and Description" |
| **Analogy** | Standing orders your project always follows | A standard operating procedure you pull out when the situation calls for it |

## Step 4: See Cursor Without a Communication Rule

Before adding a communication rule, run a prompt to see how Cursor
behaves by default.

13. In the Agent panel, type the following:

> *"Add a priority field to each task."*

14. Observe what happens. Cursor will make the change silently and
    without explanation.

15. Note that it did not ask for your preference on how to implement it,
    did not explain what it did, and did not offer any alternatives.

16. Undo the change using \[Ctrl+Z on Windows / Cmd+Z on Mac\] so the
    app is back to its original state.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>This is the default Cursor behavior - fast and autonomous. Rules let
you change that behavior to match how you prefer to work.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 5: Add a Communication Rule

Now add a rule that changes how Cursor communicates with you.

17. In the Agent panel, type the following to have Cursor create the
    rule:

> *"Create a communication rule for this project. Add a file called
> communication.mdc to the .cursor/rules/ folder with the following
> content: Always explain every change you make in plain English before
> making it. Always ask for confirmation before making large structural
> changes. Always suggest three implementation options when adding a new
> feature and wait for the user to choose one."*

18. Confirm the file appears in the Explorer panel under .cursor/rules/.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>You now have two rule files working together - one for project
context and one for communication style. Each rule file has a single
focused job, which makes them easy to update or reuse in other
projects.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 6: See Cursor With the Rule Applied

Run the same prompt from Step 4 and watch the difference.

19. In the Agent panel, type:

> *"Add a priority field to each task."*

20. This time, Cursor will explain what it plans to do before doing it.

21. It will offer three options for implementing the priority field, and
    you can choose one.

22. Select an option and watch Cursor apply it while narrating the
    change.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>The before and after comparison is the clearest demonstration of what
rules do. The same prompt, the same app, completely different
behavior.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 7: Upgrade the App to a Kanban Board

With your project context rule, communication rule, and card Skill in
place, ask Cursor to upgrade the task list to a full Kanban board.

23. In the Agent panel, type:

> *"Upgrade this task list into a Kanban board with three columns: To
> Do, In Progress, and Done. Each task should be a draggable card that
> can be moved between columns."*

24. Cursor will explain its plan and ask for confirmation before
    proceeding.

25. Approve the change and watch it build the Kanban board.

26. When it is done, open the internal browser to see the upgraded app.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><p><strong>⏳ WHILE CURSOR IS
WORKING</strong></p>
<ul>
<li><p>Watch the Explorer panel as files are updated</p></li>
<li><p>Notice that Cursor is explaining its steps as it goes - that is
your communication rule working</p></li>
<li><p>Compare this to Session 1 when Cursor built silently without any
explanation</p></li>
</ul></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 8: Add Color-Coded Priority Levels

Now add a priority rule so the board automatically applies colors based
on card priority.

27. In the Agent panel, type the following to have Cursor create the
    rule:

> *"Create a priority color rule for this project. Add a file called
> priority-colors.mdc to the .cursor/rules/ folder with the following
> content: Priority 1 cards are always displayed with a red background.
> Priority 2 cards are always displayed with a yellow background.
> Priority 3 cards are always displayed with a green background. These
> colors must be applied consistently across the entire app."*

28. Confirm the file appears in the Explorer panel under .cursor/rules/.

29. In the Agent panel, type:

> *"Apply priority color coding to all existing cards on the board."*

30. Watch the board update with color-coded cards.

31. Add a few test cards with different priority levels in the internal
    browser to confirm the colors are applied correctly.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Having a separate rule file for visual standards means you can reuse
it in future projects. Your color conventions become a portable
standard, not something you have to re-explain every time.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 9: Test the Full Board

32. In the internal browser, test the complete Kanban board:

- Add a new task and assign it a priority level

- Confirm the correct color appears automatically

- Drag a card from To Do to In Progress

- Drag it again to Done

- Confirm the color persists as the card moves between columns

33. Ask Cursor to make one small refinement using a natural language
    prompt. For example:

> *"Add a subtle drop shadow to the cards to make them look more like
> physical sticky notes."*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><p><strong>⏳ WHILE CURSOR IS
WORKING</strong></p>
<ul>
<li><p>Watch the internal browser to see the visual change take
effect</p></li>
<li><p>Notice that Cursor is still narrating its changes - your
communication rule is still active</p></li>
<li><p>Think about what other rules or Skills might be useful for your
own projects</p></li>
</ul></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 10: Save and Document

34. Ask Cursor to update the project documentation:

> *"Update the app review.md file in the Documentation folder to reflect
> the Kanban board upgrade, the new priority color system, and the
> custom rules we added."*

35. Confirm the file has been updated in the Explorer panel.

36. Save all files \[Ctrl+Shift+S on Windows / Cmd+Option+S on Mac\].

## What You Just Did

- Loaded a previous project and verified it was working before making
  changes

- Used a prompt to create a project context rule in .cursor/rules/

- Used a prompt to create a new-kanban-card Skill in .cursor/skills/

- Demonstrated the difference in Cursor's behavior without and with a
  communication rule

- Used a prompt to add a priority color rule

- Upgraded a task list app into a fully functional color-coded Kanban
  board

- Tested drag-and-drop and priority color coding in the internal browser

- Updated the project documentation automatically


## What Is Next

In Session 3, you will automate the Kanban board using Cursor's agent
mode and a live Slack integration. You will drop in a meeting transcript
and watch the agent read it, create tickets, assign priorities, route
them to the correct column, and send a Slack notification for every
Priority 1 item.

*Questions? Reach out after the session or connect with your session
instructor for follow-up support.*
