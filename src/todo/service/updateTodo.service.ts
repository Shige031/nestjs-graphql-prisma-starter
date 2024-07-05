import { Injectable } from '@nestjs/common';
import { Todo, TodoStatus } from '@prisma/client';
import { TodoRepository } from '../repository/todo.repository';

@Injectable()
export class UpdateTodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async updateContent({
    id,
    title,
    description,
  }: {
    id: string;
    title: string;
    description: string;
  }): Promise<Todo> {
    return await this.todoRepository.update({
      id,
      input: {
        title,
        description,
      },
    });
  }

  async updateStatus({
    id,
    status,
  }: {
    id: string;
    status: TodoStatus;
  }): Promise<Todo> {
    return await this.todoRepository.update({
      id,
      input: {
        status,
      },
    });
  }
}
