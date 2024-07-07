import { Test, TestingModule } from '@nestjs/testing';

import { mock } from 'jest-mock-extended';
import { User } from '@prisma/client';
import { CreateUserUseCase } from '../createUser.usecase';
import { FirebaseService } from 'src/util/firebase/firebase.service';
import { CreateUserService } from 'src/user/service/createUser.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { UserRepository } from 'src/user/repository/user.repository';
import { PrismaService } from 'src/prisma.service';

describe('createUserUseCase', () => {
  let service: CreateUserUseCase;
  let createUserService: CreateUserService;
  let firebaseService: FirebaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        CreateUserService,
        UserRepository,
        PrismaService,
        FirebaseService,
      ],
    }).compile();

    service = module.get<CreateUserUseCase>(CreateUserUseCase);
    createUserService = module.get<CreateUserService>(CreateUserService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  afterEach(() => jest.resetAllMocks());

  it('ユーザーが作成される', async () => {
    const input = {
      name: '不知火 フレン',
      uid: 'xxx',
    };

    const firebaseSpy = jest
      .spyOn(firebaseService, 'findByUid')
      .mockResolvedValue(
        mock<UserRecord>({
          uid: input.uid,
        }),
      );

    const createSpy = jest.spyOn(createUserService, 'handle').mockResolvedValue(
      mock<User>({
        name: input.name,
        firebaseUId: input.uid,
      }),
    );

    await service.handle(input);

    expect(firebaseSpy).toHaveBeenCalledTimes(1);
    expect(firebaseSpy).toHaveBeenCalledWith({
      uid: input.uid,
    });
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      name: input.name,
      firebaseUId: input.uid,
    });
  });
});
