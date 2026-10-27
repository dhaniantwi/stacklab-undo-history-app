
"use strict";

// ==========================================
// 1. STACK IMPLEMENTATION (LIFO)
// Last In, First Out
// ==========================================

class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }

    toArray() {
        return [...this.items];
    }
}

// ==========================================
// 2. STUDENT WORK RECOVERY STATE MANAGER
// Manages Undo and Redo using two stacks
// ==========================================

class WorkRecoveryManager {
    constructor() {
        this.undoStack = new Stack();
        this.redoStack = new Stack();

        this.editor = document.getElementById("document-content");
        this.titleInput = document.getElementById("document-title");

        this.undoButton = document.getElementById("undo-btn");
        this.redoButton = document.getElementById("redo-btn");
        this.saveButton = document.getElementById("save-btn");

        this.undoList = document.getElementById("undo-history");
        this.redoList = document.getElementById("redo-history");

        this.status = document.getElementById("save-status");
        this.wordCount = document.getElementById("word-count");
        this.characterCount = document.getElementById("character-count");

        this.maxHistory = 50;
        this.debounceTimer = null;

        this.currentState = this.captureState();

        this.loadSavedWork();
        this.updateUI();
        this.updateStatistics();
        this.attachEvents();
    }

    captureState() {
        return {
            title: this.titleInput ? this.titleInput.value : "",
            content: this.editor ? this.editor.value : ""
        };
    }

    applyState(state) {
        if (!state) return;

        if (this.titleInput) {
            this.titleInput.value = state.title;
        }

        if (this.editor) {
            this.editor.value = state.content;
        }

        this.currentState = this.captureState();
        this.updateStatistics();
    }

    saveHistory(stack, state) {
        stack.push({
            title: state.title,
            content: state.content
        });

        if (stack.size() > this.maxHistory) {
            const items = stack.toArray();
            items.shift();
            stack.clear();
            items.forEach(item => stack.push(item));
        }
    }

    recordChange() {
        const newState = this.captureState();

        if (
            newState.title === this.currentState.title &&
            newState.content === this.currentState.content
        ) {
            return;
        }

        this.saveHistory(this.undoStack, this.currentState);

        this.currentState = newState;

        // A new edit invalidates the redo history.
        this.redoStack.clear();

        this.updateStatistics();
        this.updateUI();
        this.scheduleSave();
    }

    undo() {
        if (this.undoStack.isEmpty()) {
            this.showStatus("There are no earlier changes to restore.");
            return;
        }

        this.saveHistory(this.redoStack, this.captureState());

        const previousState = this.undoStack.pop();
        this.applyState(previousState);

        this.updateUI();
        this.saveDocument();
        this.showStatus("Undo successful — previous work restored.");
    }

    redo() {
        if (this.redoStack.isEmpty()) {
            this.showStatus("There are no changes to redo.");
            return;
        }

        this.saveHistory(this.undoStack, this.captureState());

        const nextState = this.redoStack.pop();
        this.applyState(nextState);

        this.updateUI();
        this.saveDocument();
        this.showStatus("Redo successful — work restored.");
    }

    updateStatistics() {
        if (!this.editor) return;

        const text = this.editor.value;
        const words = text.trim()
            ? text.trim().split(/\s+/).length
            : 0;

        if (this.wordCount) {
            this.wordCount.textContent = words;
        }

        if (this.characterCount) {
            this.characterCount.textContent = text.length;
        }
    }

    renderStack(container, stack, label) {
        if (!container) return;

        container.replaceChildren();

        const items = stack.toArray();

        if (items.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "Stack is empty";
            container.appendChild(empty);
            return;
        }

        items.forEach((item, index) => {
            const entry = document.createElement("div");

            entry.className = "stack-item";

            if (index === items.length - 1) {
                entry.classList.add("top");
            }

            const preview = item.content
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 65);

            entry.textContent =
                `${index === items.length - 1 ? "TOP · " : ""}` +
                `${label}: ${preview || "(empty document)"}`;

            container.appendChild(entry);
        });
    }

    updateUI() {
        if (this.undoButton) {
            this.undoButton.disabled = this.undoStack.isEmpty();
        }

        if (this.redoButton) {
            this.redoButton.disabled = this.redoStack.isEmpty();
        }

        this.renderStack(this.undoList, this.undoStack, "Previous version");
        this.renderStack(this.redoList, this.redoStack, "Undone version");
    }

    saveDocument() {
        try {
            const data = {
                title: this.titleInput ? this.titleInput.value : "",
                content: this.editor ? this.editor.value : "",
                savedAt: new Date().toISOString()
            };

            localStorage.setItem(
                "studentWorkRecoveryDocument",
                JSON.stringify(data)
            );

            this.showStatus("Your work is saved in this browser.");
        } catch (error) {
            console.error("Unable to save work:", error);
            this.showStatus("Save failed. Check browser storage.");
        }
    }

    scheduleSave() {
        clearTimeout(this.debounceTimer);
        this.showStatus("Saving your work...");

        this.debounceTimer = setTimeout(() => {
            this.saveDocument();
        }, 500);
    }

    loadSavedWork() {
        try {
            const saved = localStorage.getItem(
                "studentWorkRecoveryDocument"
            );

            if (!saved) return;

            const data = JSON.parse(saved);

            if (this.titleInput && typeof data.title === "string") {
                this.titleInput.value = data.title;
            }

            if (this.editor && typeof data.content === "string") {
                this.editor.value = data.content;
            }

            this.currentState = this.captureState();
            this.showStatus("Your previously saved work was restored.");
        } catch (error) {
            console.error("Unable to restore saved work:", error);
            this.showStatus("Could not restore previously saved work.");
        }
    }

    showStatus(message) {
        if (this.status) {
            this.status.textContent = message;
        }
    }

    attachEvents() {
        if (this.editor) {
            this.editor.addEventListener("input", () => {
                this.recordChange();
            });
        }

        if (this.titleInput) {
            this.titleInput.addEventListener("input", () => {
                this.recordChange();
            });
        }

        if (this.undoButton) {
            this.undoButton.addEventListener("click", () => this.undo());
        }

        if (this.redoButton) {
            this.redoButton.addEventListener("click", () => this.redo());
        }

        if (this.saveButton) {
            this.saveButton.addEventListener("click", () => {
                clearTimeout(this.debounceTimer);
                this.saveDocument();
            });
        }

        document.addEventListener("keydown", event => {
            if ((event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "z") {
                event.preventDefault();

                if (event.shiftKey) {
                    this.redo();
                } else {
                    this.undo();
                }
            } else if ((event.ctrlKey || event.metaKey) &&
                       event.key.toLowerCase() === "y") {
                event.preventDefault();
                this.redo();
            }
        });
    }
}

// ==========================================
// 3. START APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("document-content");

    if (!editor) {
        console.error(
            "Editor not found. Check the document-content ID in index.html."
        );
        return;
    }

    window.workRecovery = new WorkRecoveryManager();
});
