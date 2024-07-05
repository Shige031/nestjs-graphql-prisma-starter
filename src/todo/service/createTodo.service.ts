import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { TodoRepository } from '../repository/todo.repository';

@Injectable()
export class CreateTodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async handle({
    userId,
    title,
    description,
  }: {
    userId: string;
    title: string;
    description: string;
  }): Promise<Todo> {
    return await this.todoRepository.create({
      input: {
        userId,
        title,
        description,
      },
    });
  }
}
