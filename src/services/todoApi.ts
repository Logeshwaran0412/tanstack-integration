import axios from 'axios';
import { Todo } from '../types/todo';

const BASE_URL = 'http://localhost:3001/api';

type TodoFilter = 'all' | 'open' | 'done';

export const todoApi = {
    getTodos: async (filter: TodoFilter = 'all'): Promise<Todo[]> => {
        const { data } = await axios.get(`${BASE_URL}/todos?filter=${filter}`);
        return data;
    },

    getTodoById: async (id: number): Promise<Todo> => {
        const { data } = await axios.get(`${BASE_URL}/todos/${id}`);
        return data;
    },

    addTodo: async (text: string): Promise<Todo> => {
        const { data } = await axios.post(`${BASE_URL}/todos`, {
            title: text,
            completed: false,
        });
        return data;
    },

    updateTodo: async (id: number, updates: Partial<Todo>): Promise<Todo> => {
        const { data } = await axios.put(`${BASE_URL}/todos/${id}`, updates);
        return data;
    },

    deleteTodo: async (id: number): Promise<void> => {
        await axios.delete(`${BASE_URL}/todos/${id}`);
    },
}; 