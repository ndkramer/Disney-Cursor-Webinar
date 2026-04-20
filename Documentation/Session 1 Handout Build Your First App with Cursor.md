![](extracted-assets/session1/media/image1.png)

# Session 1 Handout: Build Your First App with Cursor

*Disney AI Day \| Beginner Session \| April 22, 2026*

## What You Will Do

Follow these steps to recreate the task list app built during the
session. You will open Cursor, start a new project, and use a single
natural language prompt to generate a working app from scratch.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Make sure Cursor is installed on your machine before following these
steps. You can download it at cursor.com. No prior coding experience is
required to complete this guide.</p>
<p>If you would like to download a copy of this sessions code it is
available at the GitHub repository:</p>
<p>https://github.com/ndkramer/Disney-Cursor-Webinar.git</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## AI Tool Comparison: Cursor vs Claude Code

|  | **Cursor** | **Claude Code** |
|----|----|----|
| **Interface** | Custom IDE | Terminal / CLI / IDE |
| **How you interact** | Stay in the loop, guiding changes with live visual feedback | Give it a task and it works autonomously in the background |
| **AI models supported** | Multi-model: Claude (Sonnet, Opus), GPT-4o, GPT-4.1, Gemini Pro, and Auto mode | Anthropic only: Claude Haiku, Sonnet, and Opus via API or subscription |
| **Best for** | Building and iterating on apps with live visual feedback in the editor and browser | Automating large tasks, bulk refactoring, and scripting |
| **Level of control** | High touch - you see and approve changes as they happen | Low touch - you delegate, it executes end to end |
| **Context awareness** | Automatically indexes your entire codebase | Reads the files and folders you point it to |
| **Visual feedback** | Live preview in the built-in browser | Output appears in the terminal |
| **Works together?** | Cursor can invoke Claude Code to handle large automated tasks without leaving the editor | N/A |
| **When to choose it** | When you want to build, experiment, and iterate visually | When you want to automate without interruption |
| **Cost** | Free Hobby tier available. Pro \$20/month includes \$20 in model credits | No free tier. Pro \$20/month, Max from \$100/month, or pay-per-token via API |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>ChatGPT and Claude are great for questions and research. Cursor is
where you go when you are ready to build. Claude Code is a powerful
option for developers comfortable working in the terminal.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Both Cursor and Claude Code can write code in virtually any language
or framework - JavaScript, Python, Java, C#, Swift, Kotlin, React,
Django, .NET, and more. If you are already working in a specific
language or stack, you do not need to switch. Just tell Cursor what you
are using and it will work within that context.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 1: Open Cursor and Get Familiar with the Interface

1.  Launch Cursor on your computer.

2.  Take a moment to locate the three main areas you will use:

- Explorer Panel (left side) - shows your project files and folders

- Agent Panel (right side or bottom) - where you type prompts and chat
  with Cursor

- Doc Viewer / Editor (center) - where your code files open and display

3.  These three areas work together throughout the session.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>If you have used VS Code before, the layout will feel
familiar.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 2: Create a New Project Folder

4.  On your computer, create a new, empty folder somewhere easy to find
    (for example, on your Desktop or in Documents).

5.  Name it something like task-list-app.

6.  In Cursor, go to File \> Open Folder and select the folder you just
    created.

7.  The Explorer panel on the left should now show your empty project
    folder.

## Step 3: Open the Agent Panel

8.  Look for the Agent panel in the Cursor interface.

9.  If it is not visible, open it from the menu or use the keyboard
    shortcut \[Ctrl+L on Windows / Cmd+L on Mac\].

10. Confirm you are in Agent mode (not Ask mode). Agent mode allows
    Cursor to create and edit files on your behalf.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP: There are three modes in Cursor:</strong></p>
<ul>
<li><p><strong>Agent mode</strong> - builds and edits code directly in
your files. This is what you want for building apps.</p></li>
<li><p><strong>Ask mode</strong> - read-only. Use it to ask questions
without making any changes.</p></li>
<li><p><strong>Plan mode</strong> - lets you preview what Cursor will do
before any changes are applied.</p></li>
</ul></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 4: Give Cursor Your First Prompt

11. Click into the Agent chat input field.

12. Type a prompt that describes the app you want to build. Keep it
    simple and clear.

13. A good starting prompt for this app is something like:

    ```text
    Build me a simple task list web app using HTML, CSS, and JavaScript where I can add tasks, view all my tasks, and mark tasks as complete.
    ```

14. Press Enter and watch Cursor go to work.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>Specifying HTML, CSS, and JavaScript keeps the app browser-based,
which means you can preview and edit it directly inside Cursor without
any extra setup.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 5: Watch Cursor Build the App

15. As Cursor runs, you will see it create files in your Explorer panel.

16. The Agent panel will show you what it is doing at each step.

17. Do not interrupt the process. Let it finish before making any
    changes.

18. When it is done, you should see one or more new files in your
    project folder.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><p><strong>⏳ WHILE CURSOR IS
WORKING</strong></p>
<ul>
<li><p>Watch the Explorer panel on the left as your project files are
created in real time</p></li>
<li><p>Follow along in the Agent panel to see each action Cursor is
taking</p></li>
<li><p>Notice that Cursor is creating and editing multiple files at the
same time</p></li>
<li><p>When a change is proposed, look for the diff view - green lines
are additions, red lines are removals</p></li>
<li><p><strong>You have not typed a single line of
code</strong></p></li>
</ul></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 6: Run the App

19. Once Cursor has finished building, ask it how to run the app by
    typing in the Agent panel:

> *"How do I run this app?"*

20. Cursor will give you instructions. Follow them to launch the app in
    your browser or terminal.

21. You should see a working task list app with an input field and a
    list area.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>If the app does not run on the first try, do not worry. Simply
describe the error to Cursor in the Agent panel and it will help you fix
it.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 7: Use the Agent to Make Changes

22. In Cursor, open the internal browser. Look for the browser icon in
    the toolbar or in the View menu.

23. Type localhost and the port number. Cursor used to launch your app
    (it will tell you the port when it runs).

24. Your task list app should appear inside Cursor without opening an
    external browser.

25. Now try making a visual change directly from the Agent panel. For
    example:

> *"Change the background color of the page to light gray."*

26. Watch the internal browser update in real time as Cursor applies the
    change.

## Step 8: Use the Internal Browser to Make Quick UI Changes

27. Now try making a change directly in the browser view without going
    back to the Agent panel.

28. Right-click the Add button in the internal browser, then inspect the
    element.

29. In the Agent panel, type a targeted request referencing the specific
    element. For example:

> *"Change the Add button color to blue and make the text white."*

30. Watch the internal browser reflect the change immediately.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>This is one of Cursor's most powerful features for UI work. You can
point at specific elements, describe what you want, and see the result
instantly - all without leaving the editor or switching
windows.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 9: Make a Small Change Using a Natural Language Prompt

31. Try making one simple change to see how easy it is to update the
    app.

32. Type a request in the Agent panel describing what you want to
    change. For example:

> *"When a task is marked as complete, show it with a strikethrough."*

33. Cursor will update the code, and the change will be reflected when
    you refresh or re-run the app.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>The more specific your request, the better the result. If Cursor does
not get it right the first time, try rephrasing your prompt with a
little more detail.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>


## Step 10: Make Larger Changes Using the Agent

34. Now try a more complex request to see how Agent mode handles
    multi-part features in a single prompt.

35. In the Agent panel, type the following:

> *"Add an icon next to each task in the list. When clicked, the icon
> should open a pop-up that lets the user enter additional details for
> that task: Due Date, Assigned To, Description, and Priority. Once
> saved, display the Assigned To name next to the task in the list."*

36. Let the Agent run uninterrupted. This is a larger change and may
    take a moment.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><p><strong>⏳ WHILE CURSOR IS
WORKING</strong></p>
<ul>
<li><p>Click on any existing file in the Explorer panel to see the code
Cursor already generated</p></li>
<li><p>Watch the Explorer panel for new or updated files as the agent
works</p></li>
<li><p>Notice the model selector in the Agent panel - by default Cursor
is in Auto mode, which picks the best model for each task</p></li>
</ul></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

37. When it is done, test the feature in the internal browser:

- Click the icon next to a task

- Confirm the pop-up appears with all four fields

- Fill in the details and save

- Confirm the Assigned To name appears next to the task in the list

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>This is where Agent mode really shows its power. A feature that would
take a developer significant time to build manually - a pop-up form,
data binding, and dynamic list updates - was built from a single natural
language prompt.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 11: Ask Cursor to Review and Document What It Built

38. In the Agent panel, ask Cursor to explain the app and document it at
    the same time:

> *"Review everything you just built, explain how the app works in plain
> English, and save a summary to a file called app-review.md inside a
> folder called Documentation."*

39. Cursor will output the explanation directly in the Agent panel so
    you can read it immediately.

40. Check the Explorer panel on the left. You should see a new
    Documentation folder containing app-review.md.

41. Open the file to confirm it contains a clear summary of the app's
    features and how they work.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>💡 TIP</strong></p>
<p>This is a great habit to build into any project. Asking Cursor to
document what it built gives you a running record of your app that any
team member can read, even if they were not part of the original
build.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 12: Save Your Work

42. Make sure all your files are saved. You can use File \> Save All or
    the keyboard shortcut \[Ctrl+Shift+S on Windows / Cmd+Option+S on
    Mac\].

43. Your project folder now contains a fully working app that you built
    using only natural language prompts.

## What You Just Did

- Opened a new project in Cursor

- Used the Explorer panel to manage your project files

- Used Agent mode to generate a working web app from a single prompt

- Ran the app and previewed it in Cursor's internal browser

- Made real-time UI changes without leaving Cursor

- Made an edit using a natural language request

- Asked Cursor to document what it built into a file

## What Is Next

In Session 2, you will take this same app and upgrade it into a
color-coded priority Kanban board using Cursor's custom rules. You will
see how rules change how Cursor behaves and what it produces.

In Session 3, you will automate the Kanban board using Cursor's agent
mode and a live Slack integration.

*Questions? Reach out after the session or connect with your session
instructor for follow-up support.*
