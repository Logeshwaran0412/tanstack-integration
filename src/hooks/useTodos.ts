import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../services/todoApi';

export const useTodos = () => {
    const queryClient = useQueryClient();

    const { data: todos = [], isLoading: isLoadingTodos } = useQuery({
        queryKey: ['todos'],
        queryFn: todoApi.getTodos,
    });

    const addTodoMutation = useMutation({
        mutationFn: async (text: string) => {
            return await todoApi.addTodo(text);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const toggleTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            const todo = todos.find(t => t.id === id);
            if (!todo) throw new Error('Todo not found');
            return await todoApi.updateTodo(id, !todo.completed);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            return await todoApi.deleteTodo(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    return {
        todos,
        isLoadingTodos,
        addTodo: addTodoMutation.mutate,
        toggleTodo: toggleTodoMutation.mutate,
        deleteTodo: deleteTodoMutation.mutate,
        isLoading:
            addTodoMutation.isPending ||
            toggleTodoMutation.isPending ||
            deleteTodoMutation.isPending,
    };
}; 