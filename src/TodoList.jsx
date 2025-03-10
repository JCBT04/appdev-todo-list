import { useState, useEffect } from "react";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [filter, setFilter] = useState(localStorage.getItem("filter") || "all");
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document.body.className = darkMode ? "dark-mode" : "light-mode";
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem("filter", filter);
    }, [filter]);

    const addTask = () => {
        if (task.trim() === "") return;
        setTasks([...tasks, { text: task, completed: false }]);
        setTask("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (editingIndex !== null) {
                saveEditing(editingIndex);
            } else {
                addTask();
            }
        }
    };

    const toggleTaskCompletion = (index) => {
        setTasks(tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t)));
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingText(tasks[index].text);
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditingText("");
    };

    const saveEditing = (index) => {
        if (editingText.trim() === "") return;
        setTasks(tasks.map((t, i) => (i === index ? { ...t, text: editingText } : t)));
        setEditingIndex(null);
    };

    return (
        <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
            <h2>Task Manager</h2>
            <div className="command-bar">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={handleKeyDown} // Press Enter to add task
                />
                <button onClick={addTask}>Add Task</button>
                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "🌙" : "🔆"}
                </button>
            </div>
            <div className="filter-buttons">
                {["all", "completed", "pending"].map((type) => (
                    <button
                        key={type}
                        className={filter === type ? "active" : ""}
                        onClick={() => setFilter(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
            <div className="task-list-container">
                <div className="task-list">
                    {tasks.length === 0 ? (
                        <p className="no-tasks">No tasks found. Add a new task to get started!</p>
                    ) : (
                        tasks
                            .filter((t) => {
                                if (filter === "completed") return t.completed;
                                if (filter === "pending") return !t.completed;
                                return true;
                            })
                            .map((t, index) => (
                                <div
                                    key={index}
                                    className={`task-card ${t.completed ? "completed" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={t.completed}
                                        onChange={() => toggleTaskCompletion(index)}
                                    />
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            onKeyDown={handleKeyDown} // Press Enter to save edit
                                            className="edit-input"
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            className="task-text"
                                            onClick={() => toggleTaskCompletion(index)}
                                            style={{ textDecoration: t.completed ? "line-through" : "none" }}
                                        >
                                            {t.text}
                                        </span>
                                    )}
                                    <div className="task-actions">
                                        {editingIndex === index ? (
                                            <>
                                                <button className="save-btn" onClick={() => saveEditing(index)}>
                                                    Save
                                                </button>
                                                <button className="cancel-btn" onClick={cancelEditing}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button className="edit-btn" onClick={() => startEditing(index)}>
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className="remove-btn"
                                            onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
            <footer>Task Manager App © 2023</footer>
        </div>
    );
}
