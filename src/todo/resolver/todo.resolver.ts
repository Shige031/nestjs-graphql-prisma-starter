import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoModel } from '../model/todo.model';
import { CreateTodoService } from '../service/createTodo.service';
import { UpdateTodoService } from '../service/updateTodo.service';
import { UpdateTodoStatusInput } from '../dto/todo.dto';
import { DeleteTodoService } from '../service/deleteTodo.service';
import { FindManyTodoService } from '../service/findManyTodo.service';

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(
    private readonly findManyTodoService: FindManyTodoService,
    private readonly createTodoService: CreateTodoService,
    private readonly updateTodoService: UpdateTodoService,
    private readonly deleteTodoService: DeleteTodoService,
  ) {}

  @Query(() => [TodoModel])
  async todos() {
    return await this.findManyTodoService.handle({
      userId: 'xxx',
    });
  }

  @Mutation(() => TodoModel)
  async createTodo(
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<TodoModel> {
    return await this.createTodoService.handle({
      userId: 'xxx',
      title,
      description,
    });
  }

  @Mutation(() => TodoModel)
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
  async updateTodoStatus(
    @Args('input') input: UpdateTodoStatusInput,
  ): Promise<TodoModel> {
    return await this.updateTodoService.updateStatus({
      ...input,
    });
  }

  @Mutation(() => TodoModel)
  async deleteTodo(@Args('id') id: string): Promise<TodoModel> {
    return await this.deleteTodoService.handle({ id });
  }
}
