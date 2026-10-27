# StackLab: Medical & Incident Report History Engine

## Real-World Problem Solved
In high-stress environments like clinical emergency departments, disaster response centers, and dispatch hubs, incident reporting forms require frequent updates under strict time constraints. Accidental form resets, copy-paste errors, or misclicks can erase critical patient telemetry data.

`stacklab-undo-history-app` implements an in-memory **Dual-Stack (LIFO) History State Manager**. It captures multi-field atomic state snapshots of forms, allowing critical workers to instantly recover from operational mistakes using `Undo` and `Redo` without relying on slow database network round-trips.

## Core Features
- **Strict LIFO Stack Engine**: Built using custom JavaScript Stack classes (`push`, `pop`, `peek`, `isEmpty`).
- **Clean Audit Interface**: Completely free of emojis and clutter, optimized for professional dashboards.
- **Multi-Field Atomic Snapshots**: Tracks multiple form elements simultaneously (ID, Severity Level, Narrative Notes).
- **Keyboard Shortcuts**: Native support for `Ctrl + Z` (Undo) and `Ctrl + Y` (Redo).

## GitHub Pages Deployment
1. Unzip `stacklab-undo-history-app.zip`.
2. Push repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Clinical stack engine"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/stacklab-undo-history-app.git
   git push -u origin main
   ```
3. Enable GitHub Pages in **Settings** > **Pages** (Source: `main` branch, `/ (root)` folder).
