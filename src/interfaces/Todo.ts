export interface Todo {
  id: string
  createTime: number
  content: string
  status: boolean
}
export interface GetTodosResponse {
  status: boolean
  data: Todo[]
}
export interface CreateTodoResponse {
  status: boolean
  newTodo: Todo
}
export interface TodoResponse {
  status: boolean
  message: string
}
export enum Status {
  all,
  active,
  done
}
