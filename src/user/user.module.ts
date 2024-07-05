import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './repository/user.repository';
import { CreateUserService } from './service/createUser.service';
import { UpdateUserService } from './service/updateUser.service';
import { DeleteUserService } from './service/deleteUser.service';
import { CreateUserUseCase } from './usecase/createUser.usecase';
import { FindUserService } from './service/findUser.service';
import { DeleteUserUseCase } from './usecase/deleteUser.usecase';
import { UserResolver } from './resolver/user.resolver';

@Module({
  providers: [
    PrismaService,
    UserRepository,
    UserResolver,
    FindUserService,
    CreateUserService,
    UpdateUserService,
    DeleteUserService,
    CreateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
