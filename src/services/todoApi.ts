import axios from 'axios';
import { Todo } from '../types/todo';

const BASE_URL = 'http://localhost:3001/api';

export const todoApi = {
    getTodos: async (): Promise<Todo[]> => {
        const { data } = await axios.get(`${BASE_URL}/todos`);
        return data;
    },

    addTodo: async (text: string): Promise<Todo> => {
        const { data } = await axios.post(`${BASE_URL}/todos`, {
            title: text,
            completed: false,
        });
        return data;
    },

    updateTodo: async (id: number, completed: boolean): Promise<Todo> => {
        const { data } = await axios.put(`${BASE_URL}/todos/${id}`, {
            completed,
        });
        return data;
    },

    deleteTodo: async (id: number): Promise<void> => {
        await axios.delete(`${BASE_URL}/todos/${id}`);
    },
}; 