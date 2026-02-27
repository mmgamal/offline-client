import { useEffect } from "react";
import axios from "axios";
import localforage from "localforage";

export function useOfflineSync() {
    useEffect(() => {
        async function syncPending() {
            const pending = (await localforage.getItem("pendingTodos")) || [];
            if (pending.length > 0) {
                for (const todo of pending) {
                    await axios.post("https://localhost:7174/api/todo", todo);
                }
                await localforage.removeItem("pendingTodos");
            }
        }
        window.addEventListener("online", syncPending);
        //return () => window.removeEventListener("online", syncPending);
    }, []);
}
