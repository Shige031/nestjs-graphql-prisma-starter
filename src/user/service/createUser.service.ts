import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async handle({
    firebaseUId,
    name,
  }: {
    firebaseUId: string;
    name: string;
  }): Promise<User> {
    return this.userRepository.create({
      input: {
        firebaseUId,
        name,
      },
    });
  }
}
