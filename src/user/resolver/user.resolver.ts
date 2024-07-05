import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../model/user.model';
import { FindUserService } from '../service/findUser.service';
import { CreateUserUseCase } from '../usecase/createUser.usecase';
import { UpdateUserService } from '../service/updateUser.service';
import { DeleteUserUseCase } from '../usecase/deleteUser.usecase';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserUseCase,
  ) {}

  @Query(() => UserModel)
  async user(@Args('id') id: string) {
    return await this.findUserService.findById({
      id,
    });
  }

  @Mutation(() => UserModel)
  async createUser(@Args('name') name: string): Promise<UserModel> {
    return await this.createUserUseCase.handle({
      name,
      idToken: 'xxx',
    });
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Args('id') id: string,
    @Args('name') name: string,
  ): Promise<UserModel> {
    return await this.updateUserService.handle({
      id,
      name,
    });
  }

  @Mutation(() => UserModel)
  async deleteUser(@Args('id') id: string): Promise<UserModel> {
    return await this.deleteUserService.handle({
      id,
    });
  }
}
