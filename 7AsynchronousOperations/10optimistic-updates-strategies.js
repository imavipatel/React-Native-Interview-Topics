/**
 * ===================================================================
 * 📘 Optimistic Updates Strategies in React / React Native
 * ===================================================================
 *
 * 🟢 Introduction
 * -------------------------------------------------------------------
 * - Optimistic updates = Updating the UI immediately **before**
 *   the server confirms success.
 * - Makes the app feel **fast & responsive**.
 * - Later, if the server fails, we **rollback** the UI.
 *
 * Example: When you "like" a post, the heart icon turns red instantly,
 * without waiting for API response.
 *
 * ===================================================================
 * 🔹 Why Use Optimistic Updates?
 * -------------------------------------------------------------------
 * 1. Better UX → Users see instant feedback.
 * 2. Reduces perceived latency → API delays are hidden.
 * 3. Works well in apps with **likes, comments, votes, checkboxes, toggles**.
 *
 * ===================================================================
 * 🔹 Basic Strategy
 * -------------------------------------------------------------------
 * 1. Save the **previous state** (for rollback).
 * 2. Update the UI immediately with the new state.
 * 3. Trigger the API call in the background.
 * 4. If API succeeds → Keep the new state.
 * 5. If API fails → Roll back to previous state.
 *
 * ===================================================================
 * 🔹 Example: Optimistic Update with useState
 */
import React, { useState } from "react";

function LikeButton() {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const prev = liked; // store old value for rollback
    setLiked(true); // optimistic update (instant UI change)

    try {
      const res = await fetch("/api/like", { method: "POST" });
      if (!res.ok) throw new Error("Failed to like");
    } catch (err) {
      console.error("❌ Error, rolling back:", err);
      setLiked(prev); // rollback if failed
    }
  };

  return <button onClick={handleLike}>{liked ? "❤️ Liked" : "🤍 Like"}</button>;
}

/**
 * ===================================================================
 * 🔹 Optimistic Updates in React Query
 * -------------------------------------------------------------------
 * React Query has built-in support for optimistic updates.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTodo) =>
      fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(newTodo),
      }),
    onMutate: async (newTodo) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot previous state
      const prevTodos = queryClient.getQueryData(["todos"]);

      // Optimistic update
      queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);

      // Return rollback function
      return { prevTodos };
    },
    onError: (err, newTodo, context) => {
      // Rollback
      queryClient.setQueryData(["todos"], context.prevTodos);
    },
    onSettled: () => {
      // Refetch for server confirmation
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ id: Date.now(), text: "New Todo" })}
    >
      Add Todo
    </button>
  );
}

/**
 * ===================================================================
 * 🔹 Optimistic Updates in Redux Toolkit
 * -------------------------------------------------------------------
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to like");
    return postId;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    likeOptimistic: (state, action) => {
      const post = state.find((p) => p.id === action.payload);
      if (post) post.liked = true; // optimistic update
    },
    unlikeOptimistic: (state, action) => {
      const post = state.find((p) => p.id === action.payload);
      if (post) post.liked = false; // rollback
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLike.rejected, (state, action) => {
      const post = state.find((p) => p.id === action.meta.arg);
      if (post) post.liked = false; // rollback
    });
  },
});

/**
 * ===================================================================
 * 🔹 Real-World Example in React Native (Chat Message Optimistic UI)
 * -------------------------------------------------------------------
 */
import { FlatList, TextInput, Button, Text, View } from "react-native";

function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", pending: false },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const tempId = Date.now();
    const newMsg = { id: tempId, text: input, pending: true };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    try {
      const res = await fetch("/api/sendMessage", {
        method: "POST",
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error("Failed to send");

      // Mark as delivered
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, pending: false } : msg
        )
      );
    } catch (err) {
      console.log("❌ Failed to send, rolling back");
      // Rollback (remove pending message)
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={{ color: item.pending ? "gray" : "black" }}>
            {item.text}
          </Text>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TextInput value={input} onChangeText={setInput} placeholder="Type..." />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

/**
 * ===================================================================
 * 🔹 Optimistic vs Pessimistic Updates (Comparison Table)
 * -------------------------------------------------------------------
 *
 * | Feature               | Optimistic Update                   | Pessimistic Update              |
 * |-----------------------|--------------------------------------|---------------------------------|
 * | UI Update Timing      | Immediately (before server reply)   | After server confirms success   |
 * | User Experience (UX)  | Very fast, responsive               | Slower, may feel laggy          |
 * | Risk of Rollback      | Yes (if API fails)                  | No rollback needed              |
 * | Use Case              | Likes, votes, chat messages         | Payments, sensitive actions     |
 * | Error Handling        | Rollback to previous state          | Just show error, no rollback    |
 * | Complexity            | Higher (must handle rollback)       | Lower (simpler flow)            |
 *
 * Example:
 * - Optimistic → Clicking "Like" shows instantly ❤️
 * - Pessimistic → Clicking "Pay" waits until server confirms ✅
 *
 * ===================================================================
 * 🔹 Best Practices
 * -------------------------------------------------------------------
 * 1. Always store the **previous state** for rollback.
 * 2. Use libraries like **React Query / Redux Toolkit** for built-in support.
 * 3. Inform users if rollback happens (toast/snackbar).
 * 4. For critical actions (payments, sensitive updates), use
 *    "pessimistic updates" (wait for server).
 * 5. Combine with retry logic for robust apps.
 *
 * ===================================================================
 * 🔹 Q&A (Interview Style)
 * -------------------------------------------------------------------
 * Q1: What is an optimistic update?
 *   → Updating UI before server response, rolling back if failed.
 *
 * Q2: Why use optimistic updates?
 *   → Makes app feel fast and responsive by hiding network latency.
 *
 * Q3: How to handle errors in optimistic updates?
 *   → Rollback to the previous state and optionally show an error message.
 *
 * Q4: When should you avoid optimistic updates?
 *   → For critical data (bank transactions, payments) where accuracy is
 *     more important than speed.
 *
 * Q5: Difference between optimistic and pessimistic updates?
 *   → Optimistic is instant but may rollback, pessimistic waits for server
 *     but ensures correctness.
 *
 * ===================================================================
 * ✅ Final Takeaways
 * -------------------------------------------------------------------
 * - Optimistic updates = fast UI + smooth UX.
 * - Rollbacks are essential to prevent inconsistent data.
 * - Use React Query or Redux Toolkit for production apps.
 * - Pessimistic updates are safer for critical operations.
 * ===================================================================
 */
