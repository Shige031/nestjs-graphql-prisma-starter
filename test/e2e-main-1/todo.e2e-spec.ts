import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';
import { PrismaService } from 'src/prisma.service';
import { AppModule } from 'src/app.module';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TodoStatus } from '@prisma/client';

describe('TodoResolver', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // テスト用モジュール作成
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        canActivate: (context: ExecutionContext) => {
          // httpリクエストからコンテキストを作成
          const ctx = GqlExecutionContext.create(context).getContext();
          ctx.req.user = {
            id: 'testUserId0',
            firebaseUid: 'xxx',
            name: '水瀬 リエル',
            createdAt: new Date(),
          };
          return true;
        },
      })
      .compile();

    // テスト用アプリケーション起動
    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.user.create({
      data: {
        id: 'testUserId0',
        firebaseUId: 'xxx',
        name: '水瀬 リエル',
      },
    });
  });

  afterEach(async () => {
    // テストデータ削除
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // テスト用アプリケーション終了
    await app.close();
  });

  describe('todos', () => {
    it('todoを取得する', async () => {
      await prisma.todo.create({
        data: {
          userId: 'testUserId0',
          title: 'テストタイトル0',
          description: 'テストディスクリプション0',
        },
      });
      await prisma.todo.create({
        data: {
          userId: 'testUserId0',
          title: 'テストタイトル1',
          description: 'テストディスクリプション1',
        },
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query Query {
            todos {
              title
              description
              userId
              status
            }
          }`,
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.todos.length).toBe(2);
    });
  });

  describe('createTodo', () => {
    it('todoを作成する', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation Mutation($description: String!, $title: String!) {
            createTodo(description: $description, title: $title) {
              title
              description
              userId
              status
            }
          }`,
          variables: {
            title: 'テストタイトル',
            description: 'テストディスクリプション',
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.createTodo).toMatchObject({
        title: 'テストタイトル',
        description: 'テストディスクリプション',
        userId: 'testUserId0',
        status: TodoStatus.NOT_STARTED,
      });
    });
  });

  describe('updateTodoContent', () => {
    it('todoを更新する', async () => {
      await prisma.todo.create({
        data: {
          id: 'testTodoId0',
          userId: 'testUserId0',
          title: 'テストタイトル0',
          description: 'テストディスクリプション0',
        },
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation Mutation($description: String!, $updateTodoContentId: String!, $title: String!) {
            updateTodoContent(description: $description, id: $updateTodoContentId, title: $title) {
              title
              description
              userId
              status
            }
          }`,
          variables: {
            updateTodoContentId: 'testTodoId0',
            title: 'テストタイトル1',
            description: 'テストディスクリプション1',
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.updateTodoContent).toMatchObject({
        title: 'テストタイトル1',
        description: 'テストディスクリプション1',
        userId: 'testUserId0',
        status: TodoStatus.NOT_STARTED,
      });
    });
  });

  describe('updateTodoStatus', () => {
    it('todoを更新する - ステータス', async () => {
      await prisma.todo.create({
        data: {
          id: 'testTodoId0',
          userId: 'testUserId0',
          title: 'テストタイトル0',
          description: 'テストディスクリプション0',
        },
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation Mutation($input: UpdateTodoStatusInput!) {
            updateTodoStatus(input: $input) {
              title
              description
              userId
              status
            }
          }`,
          variables: {
            input: {
              id: 'testTodoId0',
              status: TodoStatus.IN_PROGRESS,
            },
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.updateTodoStatus).toMatchObject({
        title: 'テストタイトル0',
        description: 'テストディスクリプション0',
        userId: 'testUserId0',
        status: TodoStatus.IN_PROGRESS,
      });
    });
  });

  describe('deleteTodo', () => {
    it('todoを削除する', async () => {
      await prisma.todo.create({
        data: {
          id: 'testTodoId0',
          userId: 'testUserId0',
          title: 'テストタイトル0',
          description: 'テストディスクリプション0',
        },
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation Mutation($deleteTodoId: String!) {
            deleteTodo(id: $deleteTodoId) {
              title
              description
              userId
              status
            }
          }`,
          variables: {
            deleteTodoId: 'testTodoId0',
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.deleteTodo).toMatchObject({
        title: 'テストタイトル0',
        description: 'テストディスクリプション0',
        userId: 'testUserId0',
        status: TodoStatus.NOT_STARTED,
      });
      // DBから消えているか
      const targetTodo = await prisma.user.findUnique({
        where: {
          id: 'testTodoId0',
        },
      });
      expect(targetTodo).toBeNull();
    });
  });
});
