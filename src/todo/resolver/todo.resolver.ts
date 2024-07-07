import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoModel } from '../model/todo.model';
import { CreateTodoService } from '../service/createTodo.service';
import { UpdateTodoService } from '../service/updateTodo.service';
import { UpdateTodoStatusInput } from '../dto/todo.dto';
import { DeleteTodoService } from '../service/deleteTodo.service';
import { FindManyTodoService } from '../service/findManyTodo.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/decorator/user.decorator';
import { User } from '@prisma/client';

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(
    private readonly findManyTodoService: FindManyTodoService,
    private readonly createTodoService: CreateTodoService,
    private readonly updateTodoService: UpdateTodoService,
    private readonly deleteTodoService: DeleteTodoService,
  ) {}

  @Query(() => [TodoModel])
  @UseGuards(FirebaseAuthGuard)
  async todos(@UserEntity('user') user: User) {
    return await this.findManyTodoService.handle({
      userId: user.id,
    });
  }

  @Mutation(() => TodoModel)
  @UseGuards(FirebaseAuthGuard)
  async createTodo(
    @UserEntity('user') user: User,
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<TodoModel> {
    return await this.createTodoService.handle({
      userId: user.id,
      title,
      description,
    });
  }

  @Mutation(() => TodoModel)
  @UseGuards(FirebaseAuthGuard)
  async updateTodoContent(
    @Args('id') id: string,
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<TodoModel> {
    return await this.updateTodoService.updateContent({
      id,
      title,
      description,
    });
  }

  @Mutation(() => TodoModel)
  @UseGuards(FirebaseAuthGuard)
  async updateTodoStatus(
    @Args('input') input: UpdateTodoStatusInput,
  ): Promise<TodoModel> {
    return await this.updateTodoService.updateStatus({
      ...input,
    });
  }

  @Mutation(() => TodoModel)
  @UseGuards(FirebaseAuthGuard)
  async deleteTodo(@Args('id') id: string): Promise<TodoModel> {
    return await this.deleteTodoService.handle({ id });
  }
}
