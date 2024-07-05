import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany({ input }: { input: Prisma.TodoWhereInput }): PrismaPromise<Todo[]> {
    return this.prisma.todo.findMany({
      where: {
        ...input,
      },
    });
  }

  create({
    input,
  }: {
    input: Prisma.TodoUncheckedCreateInput;
  }): PrismaPromise<Todo> {
    return this.prisma.todo.create({
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
    input: Prisma.TodoUpdateInput;
  }): PrismaPromise<Todo> {
    return this.prisma.todo.update({
      data: {
        ...input,
      },
      where: {
        id,
      },
    });
  }

  delete({ id }: { id: string }): PrismaPromise<Todo> {
    return this.prisma.todo.delete({
      where: {
        id,
      },
    });
  }

  deleteMany({ input }: { input: Prisma.TodoWhereInput }) {
    return this.prisma.todo.deleteMany({
      where: {
        ...input,
      },
    });
  }
}
