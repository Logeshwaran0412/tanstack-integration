'use client';

import { useState } from 'react';
import { useTodoById } from '../hooks/useTodos';
import { todoApi } from '../services/todoApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TodoDetailProps {
    todoId: number;
}

const TodoDetail = ({ todoId }: TodoDetailProps) => {
    const { data: todo, isLoading } = useTodoById(todoId);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo?.title || '');
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: async (newTitle: string) => {
            return await todoApi.updateTodo(todoId, { title: newTitle });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            queryClient.invalidateQueries({ queryKey: ['todo', todoId] });
            setIsEditing(false);
        },
    });

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

                </div>

                {isEditing ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateMutation.mutate(title);
                        }}
                        className="space-y-4"
                    >
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
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
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