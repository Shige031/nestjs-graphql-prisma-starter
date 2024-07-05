import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { TodoStatus } from '@prisma/client';

registerEnumType(TodoStatus, {
  name: 'TodoStatus',
  description: Object.keys(TodoStatus).join(','),
});

@InputType()
export class UpdateTodoStatusInput {
  @Field(() => String)
  id!: string;

  @Field(() => TodoStatus)
  status!: TodoStatus;
}
