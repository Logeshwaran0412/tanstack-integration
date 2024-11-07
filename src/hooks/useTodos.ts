import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../services/todoApi';
import { Todo } from '../types/todo';

const todoKeys = {
    all: ['todos'] as const,
    lists: () => [...todoKeys.all, 'list'] as const,
    list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
    details: () => [...todoKeys.all, 'detail'] as const,
    detail: (id: number) => [...todoKeys.details(), id] as const,
}

export const useTodos = (filter: 'all' | 'open' | 'done' = 'all') => {
    const queryClient = useQueryClient();

    const { data: todos = [], isLoading: isLoadingTodos, error: errorTodos } = useQuery({
        queryKey: todoKeys.list(filter),
        queryFn: () => todoApi.getTodos(filter),
        staleTime: 1000 * 60 * 5,
    });

    const addTodoMutation = useMutation({
        mutationFn: async (text: string) => {
            return await todoApi.addTodo(text);
        },
        onSuccess: (data) => {

            // ✅ update the list we are currently on
            queryClient.setQueryData(todoKeys.list(filter), (oldTodos: Todo[]) => {
                return [...oldTodos, data];
            });

            // 🥳 invalidate all the lists,
            // but don't refetch the active one
            queryClient.invalidateQueries({ queryKey: todoKeys.lists(), refetchType: 'none' });
        },
    });

    const toggleTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            const todo = todos.find(t => t.id === id);
            if (!todo) throw new Error('Todo not found');
            return await todoApi.updateTodo(id, { completed: !todo.completed });
        },
        onSuccess: (updatedTodo) => {
            queryClient.setQueryData(todoKeys.list(filter), (oldTodos: Todo[]) => {
                return oldTodos.map(todo =>
                    todo.id === updatedTodo.id ? updatedTodo : todo
                );
            });

            queryClient.invalidateQueries({ queryKey: todoKeys.lists(), refetchType: 'none' });
            queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
        },
    });

    const updateTodoMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Partial<Todo> }) => {
            return await todoApi.updateTodo(id, updates);
        },
        onSuccess: (updatedTodo) => {
            queryClient.setQueryData(todoKeys.list(filter), (oldTodos: Todo[]) => {
                return oldTodos.map(todo =>
                    todo.id === updatedTodo.id ? updatedTodo : todo
                );
            });

            queryClient.invalidateQueries({ queryKey: todoKeys.lists(), refetchType: 'none' });
            queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            return await todoApi.deleteTodo(id);
        },
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(todoKeys.list(filter), (oldTodos: Todo[]) => {
                return oldTodos.filter(todo => todo.id !== deletedId);
            });

            queryClient.invalidateQueries({ queryKey: todoKeys.lists(), refetchType: 'none' });
            queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
        },
    });

    return {
        todos,
        isLoadingTodos,
        errorTodos,
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