import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async handle({ id, name }: { id: string; name: string }): Promise<User> {
    return this.userRepository.update({
      id,
      input: {
        name,
      },
    });
  }
}
