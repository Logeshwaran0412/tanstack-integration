import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../services/todoApi';
import { Todo } from '../types/todo';

export const useTodos = () => {
    const queryClient = useQueryClient();

    const { data: todos = [], isLoading: isLoadingTodos } = useQuery({
        queryKey: ['todos'],
        queryFn: todoApi.getTodos,
        staleTime: 1000 * 60 * 5,
    });

    const addTodoMutation = useMutation({
        mutationFn: async (text: string) => {
            return await todoApi.addTodo(text);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['todos'], (oldTodos: Todo[]) => {
                return [...oldTodos, data];
            });
        },
    });

    const toggleTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            const todo = todos.find(t => t.id === id);
            if (!todo) throw new Error('Todo not found');
            return await todoApi.updateTodo(id, { completed: !todo.completed });
        },
        onSuccess: (updatedTodo) => {

            queryClient.setQueryData(['todos'], (oldTodos: Todo[]) => {
                return oldTodos.map(todo =>
                    todo.id === updatedTodo.id ? updatedTodo : todo
                );
            });

            queryClient.setQueryData(['todo', updatedTodo.id.toString()], updatedTodo);
        },
    });

    const updateTodoMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Partial<Todo> }) => {
            return await todoApi.updateTodo(id, updates);
        },
        onSuccess: (updatedTodo) => {
            queryClient.setQueryData(['todos'], (oldTodos: Todo[]) => {
                return oldTodos.map(todo =>
                    todo.id === updatedTodo.id ? updatedTodo : todo
                );
            });
            queryClient.setQueryData(['todo', updatedTodo.id], updatedTodo);
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            return await todoApi.deleteTodo(id);
        },
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(['todos'], (oldTodos: Todo[]) => {
                return oldTodos.filter(todo => todo.id !== deletedId);
            });
            queryClient.removeQueries({ queryKey: ['todo', deletedId] });
        },
    });

    return {
        todos,
        isLoadingTodos,
        addTodo: addTodoMutation.mutate,
        toggleTodo: toggleTodoMutation.mutate,
        updateTodo: updateTodoMutation.mutate,
        deleteTodo: deleteTodoMutation.mutate,
        isLoading:
            addTodoMutation.isPending ||
            toggleTodoMutation.isPending ||
            updateTodoMutation.isPending ||
            deleteTodoMutation.isPending,
    };
};

export const useTodoById = (id: number) => {
    return useQuery({
        queryKey: ['todo', id],
        queryFn: () => todoApi.getTodoById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}; 