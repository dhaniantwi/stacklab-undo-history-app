// --- Custom Stack Implementation ---
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

// --- Application State Manager ---
class AppStateManager {
    constructor() {
        this.undoStack = new Stack();
        this.redoStack = new Stack();
        this.currentState = null;
    }

    executeAction(newState, description = "Action") {
        if (this.currentState !== null) {
            this.undoStack.push({ state: this.currentState, description });
        }
        this.currentState = newState;
        // Rules of Undo/Redo: Executing new action clears Redo Stack
        this.redoStack.clear();
        this.updateUI();
    }

    undo() {
        if (this.undoStack.isEmpty()) return null;

        // Push current state to Redo Stack
        this.redoStack.push({ state: this.currentState, description: "Undo step" });

        // Pop state from Undo Stack
        const lastAction = this.undoStack.pop();
        this.currentState = lastAction.state;

        this.updateUI();
        return this.currentState;
    }

    redo() {
        if (this.redoStack.isEmpty()) return null;

        // Push current state to Undo Stack
        this.undoStack.push({ state: this.currentState, description: "Redo step" });

        // Pop state from Redo Stack
        const nextAction = this.redoStack.pop();
        this.currentState = nextAction.state;

        this.updateUI();
        return this.currentState;
    }

    updateUI() {
        // Update Buttons state
        document.getElementById('undo-btn').disabled = this.undoStack.isEmpty();
        document.getElementById('redo-btn').disabled = this.redoStack.isEmpty();

        // Update Counts
        document.getElementById('undo-count').textContent = this.undoStack.size();
        document.getElementById('redo-count').textContent = this.redoStack.size();

        // Render Stack Visualizers
        this.renderStack('undo-stack-list', this.undoStack.toArray());
        this.renderStack('redo-stack-list', this.redoStack.toArray());
    }

    renderStack(elementId, items) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = '<div class="empty-state">Stack is Empty</div>';
            return;
        }

        // Display stack items (top element highlighted)
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'stack-item' + (index === items.length - 1 ? ' top' : '');
            const textPreview = typeof item.state === 'string' 
                ? (item.state.length > 18 ? item.state.substring(0, 18) + '...' : item.state || '[Empty]') 
                : item.description;
            div.textContent = `[${index}] ${textPreview}`;
            container.appendChild(div);
        });
    }
}

// --- Initialize App ---
const stateManager = new AppStateManager();

// Text Editor DOM
const editor = document.getElementById('editor-textarea');
let debounceTimer;

// Initial state
stateManager.currentState = editor.value;

// Event: Track Text Changes with Debounce
editor.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        stateManager.executeAction(editor.value, "Type Text");
    }, 400); // 400ms debounce to prevent spamming stack on every keypress
});

// Event: Undo Button
document.getElementById('undo-btn').addEventListener('click', () => {
    const previousState = stateManager.undo();
    if (previousState !== null) {
        editor.value = previousState;
    }
});

// Event: Redo Button
document.getElementById('redo-btn').addEventListener('click', () => {
    const nextState = stateManager.redo();
    if (nextState !== null) {
        editor.value = nextState;
    }
});

// Event: Keybindings (Ctrl+Z, Ctrl+Y)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        document.getElementById('undo-btn').click();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        document.getElementById('redo-btn').click();
    }
});

// Preset Snippets
document.getElementById('add-text-snippet').addEventListener('click', () => {
    editor.value += "\n[StackLab Snippet: LIFO Stack Operations]";
    stateManager.executeAction(editor.value, "Insert Snippet");
});

// Clear Button
document.getElementById('clear-btn').addEventListener('click', () => {
    editor.value = "";
    stateManager.executeAction("", "Clear Editor");
});

// Tab Switcher
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});
