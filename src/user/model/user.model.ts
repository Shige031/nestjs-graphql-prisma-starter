import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;
}
