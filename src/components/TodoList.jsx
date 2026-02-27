import React, { useState, useEffect } from "react";
import { fetchTodos, addTodo } from "../api/todoApi";
import { useOfflineSync } from "../hooks/useOfflineSync";

export default function TodoList() {
    const [allTodos, setTodos] = useState([]);
    const [title, setTitle] = useState("");

    useOfflineSync();

    useEffect(() => {
        fetchTodos().then(res => {
            let newTodos = [];
            newTodos.push(res);
            setTodos(res)
        });
    }, []);

    const handleAdd = async () => {
        await addTodo({ title, isCompleted: false });
        if (allTodos) {
            setTodos([...allTodos, { title, isCompleted: false }]);
        } else {
            let newTodo = [];
            newTodo.push({ title, isCompleted: false })
            setTodos(newTodo);
        }
        setTitle("");
    };

    return (
        <div>
            <h1>My Todos</h1>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <button onClick={handleAdd}>Add</button>
            <div className="todo-grid">
                {allTodos && allTodos.map((t, i) => (
                    <div key={i} className="todo-item">
                        {t.title}
                    </div>
                ))}
            </div>
        </div>
    );
}
