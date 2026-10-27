# StackLab — Undo History Simulator

A browser-based Data Structures assignment demonstrating a **stack** through an undo-history application.

## Assignment
**Describe real-world applications that require stacks as a data structure, explain why stacks are necessary, and choose one application to develop.**

The site explains stack applications and develops an Undo History Simulator.

## Real-world applications
- Undo/redo in text editors
- Browser navigation history
- Function calls and recursion
- Expression processing in compilers and calculators
- Backtracking in games and search
- Checking balanced brackets and symbols

## Operations demonstrated
- **Push:** Add an action to the top.
- **Pop:** Undo/remove the most recently added action.
- **Peek:** View the top item without removing it.
- **isEmpty:** Check whether the stack has items.
- **Size:** Display the number of items.

The app follows **LIFO (Last In, First Out)** and uses JavaScript array `push()` and `pop()`.

## Files
- `index.html` — content and assignment explanation
- `style.css` — responsive design
- `script.js` — stack logic

## Run / publish
Open `index.html` in a modern browser. For GitHub Pages, upload all four files to the repository root and publish from `main`.

## Limitation
The stack is stored in browser memory and resets when the page is refreshed. This is an educational demonstration.
