import React, { useEffect, useCallback } from "react";
import TodoList from './components/TodoList';
import axios from "axios";
import localforage from "localforage";

import './App.css';
import { keepAlive } from "./api/todoApi";

function App() {
    const API_URL = "https://localhost:7174/api/todo";

    const checkApi = useCallback(async () => {
        const status = await keepAlive();
        if (status === 200) {
            const pending = (await localforage.getItem("pendingTodos")) || [];
            if (pending.length > 0) {
                for (const todo of pending) {
                    await axios.post("https://localhost:7174/api/todo", todo);
                }
                await localforage.removeItem("pendingTodos");
            }
        }
    }, [])

    useEffect(() => {
        // Initial check 
        async function fetchData() {
            checkApi();
        }
        fetchData();
        // Keep checking every 30 seconds 
        const interval = setInterval(() => {
            checkApi();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <TodoList />
        </div>
    );
}

export default App;