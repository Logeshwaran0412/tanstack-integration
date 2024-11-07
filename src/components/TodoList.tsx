'use client';

import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import Link from 'next/link';

const TodoList = () => {
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
    const { todos, addTodo, toggleTodo, deleteTodo, isLoading, isLoadingTodos, errorTodos } = useTodos(filter);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim()) {
            addTodo(newTodo);
            setNewTodo('');
        }
    };

    if (isLoadingTodos) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (errorTodos) {
        return <div>Error: {errorTodos.message}</div>;
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'open' | 'done')}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                    <option value="all">All Todos</option>
                    <option value="open">Open Todos</option>
                    <option value="done">Completed Todos</option>
                </select>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Enter a new todo..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        Add Todo
                    </button>
                </div>
            </form>

            <div className="space-y-2">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center gap-2 p-4 border rounded-lg"
                    >
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className="h-5 w-5"
                        />
                        <Link href={`/todo/${todo.id}`} className="flex-1">
                            <span
                                className={`flex-1 text-white cursor-pointer hover:text-blue-300 ${todo.completed ? 'line-through' : ''
                                    }`}
                            >
                                {todo.title}
                            </span>
                        </Link>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="px-2 py-1 text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

        </div >
    );
};

export default TodoList; 