import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TodoRepository } from './repository/todo.repository';
import { CreateTodoService } from './service/createTodo.service';
import { UpdateTodoService } from './service/updateTodo.service';
import { DeleteTodoService } from './service/deleteTodo.service';
import { FindManyTodoService } from './service/findManyTodo.service';
import { TodoResolver } from './resolver/todo.resolver';

@Module({
  providers: [
    PrismaService,
    TodoResolver,
    TodoRepository,
    FindManyTodoService,
    CreateTodoService,
    UpdateTodoService,
    DeleteTodoService,
  ],
})
export class TodoModule {}
