import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { TodoRepository } from '../repository/todo.repository';

@Injectable()
export class FindManyTodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async handle({ userId }: { userId: string }): Promise<Todo[]> {
    return await this.todoRepository.findMany({
      input: {
        userId,
      },
    });
  }
}
