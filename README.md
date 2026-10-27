# StackLab: Undo/Redo History Engine

A production-ready web application built to demonstrate **Stack Data Structures** in real-world interactive software.

## 🚀 Features
- **Dual Stack Engine**: Implements `UndoStack` and `RedoStack` following LIFO principles.
- **Real-Time Visualizer**: Visualizes stack mutations (Push, Pop, Top peek) live as you edit text.
- **Debounced State Capture**: Automatically creates atomic undo states without cluttering memory on every keystroke.
- **Keyboard Shortcuts**: Built-in support for `Ctrl + Z` (Undo) and `Ctrl + Y` (Redo).

## 🛠️ Deployment to GitHub Pages

1. **Extract Zip**: Unzip `stacklab-undo-history-app.zip`.
2. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: StackLab application"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/stacklab-undo-history-app.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages**.
   - Under **Source**, select `main` branch and `/ (root)`.
   - Click **Save**. Your site will be live in ~1 minute!
