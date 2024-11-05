import TodoDetail from "@/components/TodoDetail";

export default function TodoPage({ params }: { params: { id: number } }) {
    return <TodoDetail todoId={params?.id} />;
}