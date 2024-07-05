import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DeleteUserService } from '../service/deleteUser.service';
import { FindUserService } from '../service/findUser.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  async handle({ id }: { id: string }): Promise<User> {
    const user = this.findUserService.findById({ id });
    // firebaseからユーザーを削除する処理が入る
    return this.deleteUserService.handle({
      id,
    });
  }
}
