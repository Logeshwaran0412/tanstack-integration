'use client';

import { useState } from 'react';
import { useTodoById, useTodos } from '../hooks/useTodos';

interface TodoDetailProps {
    todoId: number;
    onClose: () => void;
}

const TodoDetail = ({ todoId, onClose }: TodoDetailProps) => {
    const { data: todo, isLoading } = useTodoById(todoId);
    const { updateTodo } = useTodos();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo?.title || '');

    const handleUpdate = () => {
        if (todo) {
            updateTodo(
                { id: todo.id, updates: { title } },
                {
                    onSuccess: () => {
                        setIsEditing(false);
                    },
                    onError: (error) => {
                        console.error('Failed to update todo:', error);
                        alert('Failed to update todo. Please try again.');
                    },
                }
            );
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!todo) {
        return <div>Todo not found</div>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-black">Todo Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-black">{todo.title}</p>
                        <p className="text-gray-600">
                            Status: {todo.completed ? 'Completed' : 'Pending'}
                        </p>
                        <button
                            onClick={() => {
                                setTitle(todo.title);
                                setIsEditing(true);
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoDetail; 