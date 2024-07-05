import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserService } from '../service/createUser.service';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly createUserService: CreateUserService) {}

  async handle({
    name,
    idToken,
  }: {
    name: string;
    idToken: string;
  }): Promise<User> {
    // firebaseからuidをとってくる処理が入る
    return this.createUserService.handle({
      firebaseUId: 'xxx',
      name,
    });
  }
}
