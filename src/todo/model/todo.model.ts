import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TodoStatus } from '@prisma/client';

registerEnumType(TodoStatus, {
  name: 'TodoStatus',
  description: Object.keys(TodoStatus).join(','),
});

@ObjectType()
export class TodoModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => TodoStatus)
  status: TodoStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;
}
