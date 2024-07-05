import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async handle({ id }: { id: string }): Promise<User> {
    return this.userRepository.delete({
      id,
    });
  }
}
