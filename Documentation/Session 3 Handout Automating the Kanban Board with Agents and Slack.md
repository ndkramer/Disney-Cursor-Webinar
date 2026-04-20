![](extracted-assets/session3/media/image1.png)

# Session 3 Handout: Automating the Kanban Board with Agents and Slack

*Disney AI Day \| Advanced Session \| April 22, 2026*

## What You Will Do

Pick up where Session 2 left off. You will use Plan mode to map out
everything you want to build this session before writing a single line
of code. You will then configure a Slack MCP integration, and use the
agent to automate the Kanban board - dropping in a meeting transcript
and watching it turn into prioritized, color-coded, routed tickets with
live Slack notifications for Priority 1 items.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>You will need the Kanban board app from Session 2 with all three rule
files and the Skill in place. Open Cursor and load your task-list-app
folder. If you do not have it, a copy is available in the shared GitHub
repository:</p>
<p>https://github.com/ndkramer/Disney-Cursor-Webinar.git</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 1: Open Your Project from Session 2

1.  Launch Cursor on your computer.

2.  Go to File \> Open Folder and select your task-list-app folder.

3.  Confirm your .cursor/rules/ folder contains all three rule files
    from Session 2:

- project-context.mdc

- communication.mdc

- priority-colors.mdc

4.  Open the internal browser and run the app to confirm the Kanban
    board is working before making any changes.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Always verify your starting point. The automation we are building in
this session depends on the rules and Skill from Session 2 being in
place.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 2: Give Cursor Full Context from Session 2

Before switching to Plan mode, verify and give Cursor full context by
referencing the documentation you created in Session 2.

5.  In the Explorer panel, open Documentation/app-review.md.

6.  Confirm it mentions the Kanban board, the three columns (To Do, In
    Progress, Done), and the priority color system. If it only describes
    a basic task list, it was not updated at the end of Session 2. Ask
    your instructor for an updated copy before proceeding.

7.  Once confirmed, open a new Agent chat and type:

> *"Read the file at Documentation/app-review.md and use it as context
> for everything we do in this session."*

8.  Confirm Cursor acknowledges the file and summarizes the Kanban board
    project correctly.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>This is a good habit for any multi-session project. Cursor
automatically indexes your project files, but there is a difference
between having access to a file and actively using it as context. By
pointing Cursor at your documentation at the start of a new chat, you
are telling it where to start - not just what files exist.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 3: Use Plan Mode to Map Out Session 3

Plan mode lets you describe what you want to build and get a full plan
from Cursor before any changes are made. This is the professional way to
approach complex, multi-step work.

9.  In the Agent panel, switch to Plan mode using the mode selector.

10. Type the following prompt:

> *"Based on the app-review.md context, create a detailed plan for the
> following session goals: 1. Connect the app to Slack using MCP so it
> can send notifications. 2. Build an automation that reads a meeting
> transcript, extracts action items, creates Kanban cards for each one,
> assigns a priority level based on urgency, routes each card to the
> correct column, and sends a Slack notification for every Priority 1
> card. 3. Test the full automation end-to-end with a sample transcript.
> Do not make any changes yet - create the plan."*

11. Review the plan Cursor generates. Read through each step and confirm
    it matches your intentions.

12. If anything looks wrong, refine the plan by telling Cursor what to
    change before proceeding.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Plan mode is the most important mode for complex or high-stakes work.
It shows you exactly what the agent intends to do before touching a
single file. Get into the habit of planning first, especially when the
agent will be making changes across multiple files or connecting to
external services.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 4: Save the Plan and Begin

13. In the Agent panel, type:

> *"Save this plan to a file called project-plan.md inside the
> Documentation folder."*

14. Confirm the file appears in the Explorer panel under
    Documentation/project-plan.md.

15. Open the file and review it. This will serve as your guide for the
    rest of the session.

16. Switch back to Agent mode using the mode selector.

17. In the Agent panel, type:

> *"Read Documentation/project-plan.md and confirm you are ready to
> begin executing the plan."*

18. Cursor will summarize the plan and confirm it is ready to proceed.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Saving plans as markdown files gives your team a record of what was
intended, what was built, and why decisions were made. It is also useful
for resuming interrupted work or onboarding a new team member to the
project.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 5: Configure the Slack MCP Integration

MCP (Model Context Protocol) allows Cursor's agent to connect to
external tools and services. In this step, you will configure the Slack
MCP so the agent can send notifications directly to a Slack channel.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>📋 NOTE FOR CLASS</strong></p>
<p>The Slack MCP has been pre-configured for today's demo. Your
instructor will walk through the configuration steps below, but you will
not need to complete them on your own machine during the session. Follow
along to understand the setup so you can replicate it in your own
environment.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### What MCP Is

- MCP is an open standard that lets AI agents connect to external
  services

- Once configured, the agent can read from and write to those services
  as part of any task

- Cursor supports MCP servers for tools like Slack, GitHub, Jira,
  Notion, and more

### Steps to Configure Slack MCP

19. In Cursor, open Settings \> MCP.

20. Click Add MCP Server.

21. Enter the following details:

- **Name:** Slack

- **Type:** URL

- **URL:** Your Slack MCP server URL

22. Authenticate with your Slack workspace when prompted.

23. Select the channel you want the agent to post notifications to.

24. Save the configuration.

25. Confirm the Slack MCP server shows a green connected status in
    Settings.

### Test the Connection

26. In the Agent panel, type:

> *"Send a test message to the Slack channel that says: Cursor MCP
> connection confirmed."*

27. Check your Slack channel to confirm the message arrived.

28. In the Agent panel, type:

> *"Update Documentation/project-plan.md to mark the Slack MCP
> configuration as complete."*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Always test your MCP connection before relying on it in a demo or
production workflow. A failed connection mid-demo is avoidable with a
quick test upfront.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 6: Build the Transcript Automation

Now build the automation that reads a meeting transcript and populates
the Kanban board.

29. In the Agent panel, type:

> *"Following the project-plan.md, build a feature that reads a meeting
> transcript file, extracts all action items, creates a Kanban card for
> each one, assigns a priority level based on urgency (1 for critical, 2
> for important, 3 for normal), routes each card to the correct column
> based on status, and applies the correct priority color. Do not run it
> yet - build the feature."*

30. Cursor will explain its plan and ask for confirmation before making
    changes.

31. Approve the changes and let the agent build.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><p><strong>⏳ WHILE CURSOR IS
WORKING</strong></p>
<ul>
<li><p>Watch the Explorer panel for new or updated files</p></li>
<li><p>Notice the agent is working across multiple files
simultaneously</p></li>
<li><p>Your communication rule is still active - Cursor is narrating
every change</p></li>
<li><p>This is the same agent that built your entire app in Session 1,
now handling a far more complex task</p></li>
</ul></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

32. Once complete, type:

> *"Update Documentation/project-plan.md to mark the transcript
> automation build as complete."*

## Step 7: Add Slack Notifications for Priority 1 Cards

33. In the Agent panel, type:

> *"Following the project-plan.md, add a Slack notification trigger.
> Whenever a Priority 1 card is created from the transcript automation,
> send a Slack message to the configured channel with the card title,
> assigned to, and due date."*

34. Cursor will confirm the Slack MCP is connected and configure the
    notification.

35. Approve the changes.

36. Once complete, type:

> *"Update Documentation/project-plan.md to mark the Slack notification
> trigger as complete."*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>MCP notifications can be triggered by any agent action - not just
card creation. You could configure Cursor to notify your team when a
deployment completes, when a bug is logged, or when a deadline is
approaching.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 8: Run the Automation with a Sample Transcript

Sample meeting transcripts are available in the Transcripts folder
shared with you for this session. They are based on real park-and-ship
operations scenarios.

37. In the Agent panel, type:

> *"Read the transcript at Transcripts/park-ops-meeting.md and run the
> full automation - extract action items, create Kanban cards, assign
> priorities, route to the correct columns, apply colors, and send Slack
> notifications for any Priority 1 cards."*

38. Watch the agent work through each step and narrate what it is doing
    at each step.

39. When it is done, open the internal browser and review the populated
    Kanban board.

40. Check your Slack channel to confirm Priority 1 notifications
    arrived.

41. Once complete, type:

> *"Update Documentation/project-plan.md to mark the first transcript
> test as complete."*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><p><strong>⏳ WHILE CURSOR IS
WORKING</strong></p>
<ul>
<li><p>Watch the Kanban board populate in the internal browser in real
time</p></li>
<li><p>Notice the agent is reading a document, making decisions, and
triggering an external service - all from one prompt</p></li>
<li><p>Count how many cards it creates and check the priority
assignments</p></li>
</ul></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 9: Try the Second Transcript (Optional - time permitting)

42. In the Agent panel, type:

> *"Now read the transcript at Transcripts/ship-ops-meeting.md and run
> the same automation."*

43. Watch the board update with the new cards from the ship operations
    meeting.

44. Confirm Slack notifications fired for any Priority 1 items.

## What You Just Did

- Loaded a previous project and verified all rules and Skills were in
  place

- Referenced existing documentation to give Cursor a full project
  context

- Used Plan mode to map out the full session before making any changes

- Saved the plan to Documentation/project-plan.md and watched it update
  after each completed step

- Configured a Slack MCP integration

- Built an automation that reads a meeting transcript and creates
  prioritized, color-coded, routed Kanban cards

- Triggered live Slack notifications for Priority 1 cards

- Tested the automation with a real-world park operations scenario

## What You Can Do Next

- Try connecting additional MCP servers - GitHub, Jira, Notion, and more
  are available.

- Create additional Skills for other repeatable workflows in your
  projects

- Build additional rules scoped to specific file types or parts of your
  codebase

- Use Plan mode at the start of every complex task as a standard
  practice

*Questions? Reach out after the session or connect with your session
instructor for follow-up support.*
