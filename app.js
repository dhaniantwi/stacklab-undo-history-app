// Stack Implementation (LIFO Data Structure)
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

// State Manager Handling Dual Stacks for Real-World Incident Logs
class IncidentFormStateManager {
    constructor() {
        this.undoStack = new Stack();
        this.redoStack = new Stack();
        this.currentState = null;
    }

    captureCurrentFormState() {
        return {
            patientId: document.getElementById('patient-id').value,
            severity: document.getElementById('severity-level').value,
            notes: document.getElementById('incident-notes').value
        };
    }

    applyStateToForm(state) {
        if (!state) return;
        document.getElementById('patient-id').value = state.patientId || '';
        document.getElementById('severity-level').value = state.severity || 'Low';
        document.getElementById('incident-notes').value = state.notes || '';
    }

    executeAction(description = "Edit Field") {
        const newState = this.captureCurrentFormState();
        
        // Prevent pushing duplicate consecutive states
        if (this.currentState && JSON.stringify(this.currentState) === JSON.stringify(newState)) {
            return;
        }

        if (this.currentState !== null) {
            this.undoStack.push({ state: this.currentState, description });
        }
        this.currentState = newState;
        
        // Push clears Redo Stack (Standard Undo/Redo invariant)
        this.redoStack.clear();
        this.updateUI();
    }

    undo() {
        if (this.undoStack.isEmpty()) return;

        this.redoStack.push({ state: this.currentState, description: "Reverted Change" });
        const previousAction = this.undoStack.pop();
        this.currentState = previousAction.state;

        this.applyStateToForm(this.currentState);
        this.updateUI();
    }

    redo() {
        if (this.redoStack.isEmpty()) return;

        this.undoStack.push({ state: this.currentState, description: "Restored Change" });
        const nextAction = this.redoStack.pop();
        this.currentState = nextAction.state;

        this.applyStateToForm(this.currentState);
        this.updateUI();
    }

    updateUI() {
        document.getElementById('undo-btn').disabled = this.undoStack.isEmpty();
        document.getElementById('redo-btn').disabled = this.redoStack.isEmpty();

        document.getElementById('undo-count').textContent = this.undoStack.size();
        document.getElementById('redo-count').textContent = this.redoStack.size();

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

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'stack-item' + (index === items.length - 1 ? ' top' : '');
            
            const pId = item.state.patientId ? item.state.patientId : "No-ID";
            const sev = item.state.severity || "Low";
            const notesLen = item.state.notes ? item.state.notes.length : 0;

            div.textContent = `[${index}] ${item.description} (ID: ${pId}, Sev: ${sev}, Notes: ${notesLen} chars)`;
            container.appendChild(div);
        });
    }
}

// Initialize Application
const stateManager = new IncidentFormStateManager();
stateManager.currentState = stateManager.captureCurrentFormState();

// Event Listeners for Input with Debouncing
let debounceTimer;
const inputs = ['patient-id', 'severity-level', 'incident-notes'];

inputs.forEach(id => {
    const el = document.getElementById(id);
    const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
    
    el.addEventListener(eventType, () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            stateManager.executeAction(`Update ${id}`);
        }, 350);
    });
});

// Undo and Redo Button Events
document.getElementById('undo-btn').addEventListener('click', () => stateManager.undo());
document.getElementById('redo-btn').addEventListener('click', () => stateManager.redo());

// Keyboard Shortcuts (Ctrl+Z / Ctrl+Y)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        stateManager.undo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        stateManager.redo();
    }
});

// Clinical Action Presets
document.getElementById('insert-vitals').addEventListener('click', () => {
    const textarea = document.getElementById('incident-notes');
    textarea.value += "\n[VITALS LOG]: BP: 120/80 mmHg | Heart Rate: 72 bpm | SpO2: 98%";
    stateManager.executeAction("Insert Vitals Log");
});

document.getElementById('insert-triage').addEventListener('click', () => {
    const textarea = document.getElementById('incident-notes');
    textarea.value += "\n[TRIAGE ACTION]: Patient evaluated under Emergency Severity Index Protocol Level 2. Primary nurse assigned.";
    stateManager.executeAction("Insert Triage Action");
});

// Form Reset Action
document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('patient-id').value = '';
    document.getElementById('severity-level').value = 'Low';
    document.getElementById('incident-notes').value = '';
    stateManager.executeAction("Reset Form");
});
