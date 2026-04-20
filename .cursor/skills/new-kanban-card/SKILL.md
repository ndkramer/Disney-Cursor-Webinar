---
name: new-kanban-card
description: Create a new Kanban card when a user asks to add a task, create a ticket, or add a card to the board. Collects Title, Priority (1=red, 2=yellow, 3=green), Assigned To, Due Date, and Description, defaults the card to the To Do column, applies the priority background color, and confirms with the user before adding it to the board.
---

# New Kanban Card

Use this skill whenever the user asks to add a task, create a ticket, open a story, or add a card to the Kanban board.

## Required fields

Always collect all five fields before creating a card. If the user hasn't supplied one, ask for it.

| Field | Notes |
|-------|-------|
| Title | Short, descriptive name for the card |
| Priority | `1` = red (high), `2` = yellow (medium), `3` = green (low) |
| Assigned To | Person responsible for the card |
| Due Date | Target completion date |
| Description | Details about what needs to be done |

## Workflow

1. **Collect** all five required fields from the user. Ask for anything missing.
2. **Default the column** to **To Do**. New cards always start here, regardless of context.
3. **Apply the priority background color** to the card based on the Priority value:
   - `1` → red
   - `2` → yellow
   - `3` → green
4. **Confirm with the user** by summarizing the card (Title, Priority + color, Assigned To, Due Date, Description, Column = To Do) and asking for explicit approval before adding it.
5. **Add the card to the board** only after the user confirms.

## Confirmation template

Before adding the card, present it like this:

```
About to add this card to the To Do column:

  Title:        <title>
  Priority:     <1|2|3> (<red|yellow|green>)
  Assigned To:  <name>
  Due Date:     <date>
  Description:  <description>

Proceed? (y/n)
```

## Rules

- Never skip the confirmation step, even if all fields were provided up front.
- Never place a new card in **In Progress** or **Done** — always **To Do**.
- Always refer to the item as a **card** (not a task or ticket) in responses to the user.
- Priority values outside `1`, `2`, or `3` are invalid — ask the user to pick one of the three.
