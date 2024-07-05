import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class FindUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById({ id }: { id: string }): Promise<User> {
    return this.userRepository.findUniqueOrThrow({
      input: {
        id,
      },
    });
  }

  async findByUId({ uid }: { uid: string }): Promise<User> {
    return this.userRepository.findUniqueOrThrow({
      input: {
        firebaseUId: uid,
      },
    });
  }
}
