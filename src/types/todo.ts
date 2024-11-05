export interface Todo {
    id: number,
    title: string,
    completed: boolean,
    comment: {
        id: number,
        text: string
    }
} 