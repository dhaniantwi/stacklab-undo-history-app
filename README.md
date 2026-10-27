
# Student Work Recovery System

### A Stack-Based Application for Recovering Student Writing

## 1. Project Overview

The Student Work Recovery System is a browser-based application designed to help students recover previous versions of their writing when they accidentally delete, replace, or modify text.

Students frequently work on assignments, reports, research papers, and other academic documents. Losing important text can waste time and affect productivity.

This project demonstrates how the **Stack data structure** can solve this real-world problem through Undo and Redo functionality.

## 2. Problem Statement

Students often make mistakes while editing their academic work. They may accidentally delete an important paragraph, replace a sentence, or make changes they later regret.

Without a recovery mechanism, students may have to rewrite the lost content manually.

The Student Work Recovery System addresses this problem by storing previous versions of the document and allowing users to move backward and forward through their editing history.

## 3. Real-World Applications of Stacks

Stacks are used in many practical computing applications:

1. **Undo and Redo operations:** Text editors use stacks to reverse and restore changes.
2. **Browser navigation:** Browsers can use stack-based history mechanisms to manage navigation.
3. **Function calls:** Programming languages use call stacks to manage function execution.
4. **Expression evaluation:** Compilers and calculators use stacks to process expressions.
5. **Balanced parentheses:** Compilers use stacks to check matching brackets in source code.
6. **Backtracking:** Algorithms use stacks to return to earlier states when exploring possible solutions.

## 4. Why Stacks Are Necessary

A stack follows the **Last In, First Out (LIFO)** principle. The last item added to a stack is the first item removed.

This principle is suitable for Undo and Redo functionality because the most recent editing action should normally be reversed first.

The main stack operations are:

- **Push:** Add an item to the top of the stack.
- **Pop:** Remove and return the item at the top.
- **Peek:** View the top item without removing it.
- **isEmpty:** Check whether the stack contains any items.

In this application, JavaScript arrays implement the stack operations using `push()` and `pop()`.

## 5. How the Application Works

### Undo Stack

Before a change is accepted into the editing history, the previous document content is pushed onto the Undo Stack.

When the user clicks Undo:

1. The current content is pushed onto the Redo Stack.
2. The latest previous version is popped from the Undo Stack.
3. That version is restored in the editor.

### Redo Stack

When the user clicks Redo:

1. The current content is pushed onto the Undo Stack.
2. The latest undone version is popped from the Redo Stack.
3. The restored version appears in the editor.

When the user makes a new edit after undoing an action, the Redo Stack is cleared because the previous redo sequence is no longer valid.

### Automatic Saving

The application saves the document title and content in the browser's local storage. This allows the saved document to be restored after refreshing the page in the same browser.

The undo and redo histories are maintained in memory and reset when the page reloads.

## 6. Technologies Used

- **HTML5:** Structures the application's interface.
- **CSS3:** Provides styling, layout, animations, and responsive design.
- **JavaScript:** Implements stack operations, document editing, undo and redo, and automatic saving.
- **Browser Local Storage:** Stores the document title and content locally.
- **GitHub:** Hosts the source code.
- **GitHub Pages:** Publishes the application online.

## 7. Key Features

- Document editing in the browser.
- Undo and Redo functionality.
- Visual representation of both stacks.
- Automatic saving of document content.
- Manual Save button.
- Word and character counts.
- Responsive user interface.
- Limited editing history to manage memory usage.

## 8. Algorithm

### Undo Algorithm

1. Check whether the Undo Stack is empty.
2. If it is empty, display a message.
3. Otherwise, push the current document onto the Redo Stack.
4. Pop the top item from the Undo Stack.
5. Restore the popped content in the editor.
6. Update the displayed stacks and save the document.

### Redo Algorithm

1. Check whether the Redo Stack is empty.
2. If it is empty, display a message.
3. Otherwise, push the current document onto the Undo Stack.
4. Pop the top item from the Redo Stack.
5. Restore the popped content in the editor.
6. Update the displayed stacks and save the document.

## 9. Time and Space Complexity

Let *n* represent the number of characters in a document and *h* the number of stored history entries.

| Operation | Complexity |
|---|---|
| Push a history entry | O(1) amortized |
| Pop a history entry | O(1) |
| Undo or Redo | O(n) for copying and restoring document text |
| Display stack history | O(h × n) in the worst case |
| History storage | O(h × n) |

The history is limited to 50 entries per stack to prevent unlimited growth.

## 10. Limitations

- The document is stored locally in the browser rather than on a remote server.
- Saved work is not automatically synchronized between devices.
- Clearing browser storage may remove the saved document.
- Undo and Redo history is lost when the page is refreshed.
- The application currently focuses on a single document.

## 11. Future Improvements

Possible future enhancements include:

- Multiple document management.
- Downloading documents as text files.
- Persistent Undo and Redo history.
- Cloud backup and synchronization.
- Keyboard shortcuts such as Ctrl+Z and Ctrl+Y.
- User accounts and secure document storage.

## 12. Conclusion

The Student Work Recovery System demonstrates how the Stack data structure can solve a practical problem in everyday academic work.

By applying the LIFO principle to Undo and Redo operations, the application enables students to recover earlier versions of their writing and work more confidently.

This project illustrates the importance of data structures in developing useful, real-world software applications.
