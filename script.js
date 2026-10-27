
"use strict";

// ============================================
// STUDENT WORK RECOVERY SYSTEM
// Stack implementation: LIFO (Last In, First Out)
// ============================================

const editor = document.getElementById("document-content");
const titleInput = document.getElementById("document-title");

const undoButton = document.getElementById("undo-btn");
const redoButton = document.getElementById("redo-btn");
const saveButton = document.getElementById("save-btn");

const undoHistoryView = document.getElementById("undo-history");
const redoHistoryView = document.getElementById("redo-history");

const saveStatus = document.getElementById("save-status");
const wordCount = document.getElementById("word-count");
const characterCount = document.getElementById("character-count");

const STORAGE_KEY = "studentWorkRecoveryDocument";
const MAX_HISTORY = 50;

// The two stacks store previous and undone versions.
const undoStack = [];
const redoStack = [];

let lastContent = "";
let saveTimer = null;

// ============================================
// LOAD SAVED DOCUMENT
// ============================================

function loadDocument() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const documentData = JSON.parse(saved);

            if (typeof documentData.content === "string") {
                editor.value = documentData.content;
            }

            if (
                typeof documentData.title === "string" &&
                titleInput
            ) {
                titleInput.value = documentData.title;
            }

            showStatus("Your saved work has been restored.");
        }
    } catch (error) {
        console.error("Could not load saved document:", error);
        showStatus("Could not restore saved work.");
    }

    lastContent = editor.value;
    updateStatistics();
    renderStacks();
}

// ============================================
// SAVE DOCUMENT
// ============================================

function saveDocument(showMessage = true) {
    try {
        const documentData = {
            title: titleInput ? titleInput.value : "",
            content: editor.value,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(documentData)
        );

        if (showMessage) {
            showStatus("All changes saved in this browser.");
        }

        return true;
    } catch (error) {
        console.error("Could not save document:", error);
        showStatus("Save failed. Browser storage may be full.");
        return false;
    }
}

function scheduleAutoSave() {
    clearTimeout(saveTimer);

    showStatus("Saving your work...");

    saveTimer = setTimeout(() => {
        saveDocument();
    }, 500);
}

// ============================================
// STATUS MESSAGE
// ============================================

function showStatus(message) {
    if (saveStatus) {
        saveStatus.textContent = message;
    }
}

// ============================================
// STACK OPERATIONS
// ============================================

function pushToStack(stack, value) {
    stack.push(value);

    // Prevent unlimited history growth.
    if (stack.length > MAX_HISTORY) {
        stack.shift();
    }
}

function undo() {
    if (undoStack.length === 0) {
        showStatus("Nothing left to undo.");
        return;
    }

    // Save current work on the redo stack.
    pushToStack(redoStack, editor.value);

    // Restore the most recent previous version.
    editor.value = undoStack.pop();
    lastContent = editor.value;

    updateStatistics();
    renderStacks();
    saveDocument(false);
    showStatus("Previous change undone.");
}

function redo() {
    if (redoStack.length === 0) {
        showStatus("Nothing left to redo.");
        return;
    }

    // Save current work on the undo stack.
    pushToStack(undoStack, editor.value);

    // Restore the most recently undone version.
    editor.value = redoStack.pop();
    lastContent = editor.value;

    updateStatistics();
    renderStacks();
    saveDocument(false);
    showStatus("Change restored successfully.");
}

// ============================================
// LIVE EDITOR AND HISTORY
// ============================================

editor.addEventListener("input", () => {
    if (editor.value !== lastContent) {
        pushToStack(undoStack, lastContent);

        // New edits invalidate the redo history.
        redoStack.length = 0;

        lastContent = editor.value;
    }

    updateStatistics();
    renderStacks();
    scheduleAutoSave();
});

// ============================================
// DOCUMENT STATISTICS
// ============================================

function updateStatistics() {
    const text = editor.value;

    const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    if (wordCount) {
        wordCount.textContent = words;
    }

    if (characterCount) {
        characterCount.textContent = text.length;
    }
}

// ============================================
// DISPLAY STACKS ON THE PAGE
// ============================================

function renderOneStack(container, stack, label) {
    if (!container) return;

    container.replaceChildren();

    if (stack.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent = "No saved versions yet.";
        container.appendChild(emptyMessage);
        return;
    }

    // Display the newest item first.
    stack.forEach((value, index) => {
        const item = document.createElement("div");
        item.className = "stack-item";

        if (index === stack.length - 1) {
            item.classList.add("top");
        }

        const preview = value
            .replace(/\s+/g, " ")
            .trim();

        item.textContent =
            (index === stack.length - 1 ? "TOP · " : "") +
            label + ": " +
            (preview || "(empty document)");

        container.appendChild(item);
    });
}

function renderStacks() {
    renderOneStack(undoHistoryView, undoStack, "Previous version");
    renderOneStack(redoHistoryView, redoStack, "Undone version");

    if (undoButton) {
        undoButton.disabled = undoStack.length === 0;
    }

    if (redoButton) {
        redoButton.disabled = redoStack.length === 0;
    }
}

// ============================================
// BUTTON EVENTS
// ============================================

if (undoButton) {
    undoButton.addEventListener("click", undo);
}

if (redoButton) {
    redoButton.addEventListener("click", redo);
}

if (saveButton) {
    saveButton.addEventListener("click", () => {
        clearTimeout(saveTimer);
        saveDocument();
    });
}

// Save changes to the document title as well.
if (titleInput) {
    titleInput.addEventListener("input", scheduleAutoSave);
}

// ============================================
// START APPLICATION
// ============================================

if (editor) {
    loadDocument();
} else {
    console.error(
        "Editor not found. Check the ID document-content in index.html."
    );
}
