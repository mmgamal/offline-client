import axios from "axios";
import localforage from "localforage";

const API_URL = "https://localhost:7174/api/todo";

// Configure localforage 
localforage.config({ name: "TodosApp", storeName: "todos" });
export async function fetchTodos() {
    try {
        const res = await axios.get(API_URL);
        await localforage.setItem("todos", res.data);
        return res.data;
    } catch {
        // Offline fallback: get cached todos 
        const cached = await localforage.getItem("todos");
        return cached || [];
    }
}

export async function addTodo(todo) {
    try {
        const res = await axios.post(API_URL, todo);
        const cached = (await localforage.getItem("todos")) || [];
        cached.push(todo);
        await localforage.setItem("todos", cached);
        return res.data;
    } catch {
        // Offline fallback: save to pending store 
        const pending = (await localforage.getItem("pendingTodos")) || [];
        pending.push(todo);
        await localforage.setItem("pendingTodos", pending);
        // Also update cached todos 
        const cached = (await localforage.getItem("todos")) || [];
        cached.push(todo);
        await localforage.setItem("todos", cached);
        return todo;
    }
}

export async function keepAlive() {
    try {
        const res = await axios.get(`${API_URL}/KeepAlive`);
        if (res.status === 200) {
            console.log("✅ API is online");
        } else {
            console.log(`⚠️ API error: ${res.status}`);
        }

        return res.status;
    } catch (error) {
        console.log(error);
    }
}
