import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUniqueOrThrow({
    input,
  }: {
    input: Prisma.UserWhereUniqueInput;
  }): PrismaPromise<User> {
    return this.prisma.user.findFirstOrThrow({
      where: {
        ...input,
      },
    });
  }

  create({
    input,
  }: {
    input: Prisma.UserUncheckedCreateInput;
  }): PrismaPromise<User> {
    return this.prisma.user.create({
      data: {
        ...input,
      },
    });
  }

  update({
    id,
    input,
  }: {
    id: string;
    input: Prisma.UserUpdateInput;
  }): PrismaPromise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
  }

  delete({ id }: { id: string }): PrismaPromise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
