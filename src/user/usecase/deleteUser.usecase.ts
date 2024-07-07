import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DeleteUserService } from '../service/deleteUser.service';
import { FindUserService } from '../service/findUser.service';
import { FirebaseService } from 'src/util/firebase/firebase.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async handle({ id }: { id: string }): Promise<User> {
    const user = await this.findUserService.findById({ id });

    // firebaseからユーザーを削除
    await this.firebaseService.delete({ uid: user.firebaseUId });

    // dbからユーザーを削除
    return this.deleteUserService.handle({
      id,
    });
  }
}
