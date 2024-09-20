import { createSlice } from "@reduxjs/toolkit";
const todoSlice = createSlice({
    name: "todo",
    initialState: {
        todoList: [],
    },
    reducers: {
        addTodo(state, action) {

        }
    },
});

export const { addTodo } = todoSlice.actions;
export default todoSlice.reducer;
