export interface Todo {
    id: number,
    title: string,
    completed: boolean,
    comment: {
        id: number,
        text: string
    }
}

export type TodoFilter = 'all' | 'open' | 'done'