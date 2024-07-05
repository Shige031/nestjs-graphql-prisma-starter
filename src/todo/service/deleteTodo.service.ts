import { Injectable } from '@nestjs/common';
import { Todo, TodoStatus } from '@prisma/client';
import { TodoRepository } from '../repository/todo.repository';

@Injectable()
export class DeleteTodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async handle({ id }: { id: string }): Promise<Todo> {
    return await this.todoRepository.delete({ id });
  }
}
