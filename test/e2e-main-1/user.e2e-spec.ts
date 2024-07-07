import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';
import { PrismaService } from 'src/prisma.service';
import { AppModule } from 'src/app.module';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { FirebaseService } from 'src/util/firebase/firebase.service';

describe('UserResolver', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let fireBaseUserService: FirebaseService;

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
          // const ctx = GqlExecutionContext.create(context).getContext();
          return true;
        },
      })
      .compile();

    // テスト用アプリケーション起動
    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    fireBaseUserService = app.get<FirebaseService>(FirebaseService);
  });

  afterEach(async () => {
    // テストデータ削除
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // テスト用アプリケーション終了
    await app.close();
  });

  describe('user', () => {
    it('ユーザーを取得する', async () => {
      await prisma.user.create({
        data: {
          id: 'testUserId0',
          firebaseUId: 'xxx',
          name: '水瀬 リエル',
        },
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query Query($userId: String!) {
            user(id: $userId) {
              id
              name
            }
          }`,
          variables: {
            userId: 'testUserId0',
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.user).toMatchObject({
        id: 'testUserId0',
        name: '水瀬 リエル',
      });
    });
  });

  describe('createUser', () => {
    it('ユーザーを作成する', async () => {
      fireBaseUserService.findByUid = jest.fn().mockResolvedValue({
        uid: 'xxx',
        email: 'example@test.com',
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation Mutation($name: String!, $uid: String!) {
            createUser(name: $name, uid: $uid) {
              id
              name
            }
          }`,
          variables: {
            name: '水瀬 リエル',
            uid: 'xxx',
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.createUser.name).toBe('水瀬 リエル');
    });
  });

  describe('updateUser', () => {
    it('ユーザーを更新する', async () => {
      await prisma.user.create({
        data: {
          id: 'testUserId0',
          firebaseUId: 'xxx',
          name: '水瀬 リエル',
        },
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation Mutation($updateUserId: String!, $name: String!) {
            updateUser(id: $updateUserId, name: $name) {
              id
              name
            }
          }`,
          variables: {
            updateUserId: 'testUserId0',
            name: '不知火 フレン',
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.updateUser.name).toBe('不知火 フレン');
    });
  });

  describe('deleteUser', () => {
    it('ユーザーを削除する', async () => {
      fireBaseUserService.delete = jest.fn().mockResolvedValue({
        uid: 'xxx',
        email: 'example@test.com',
      });
      await prisma.user.create({
        data: {
          id: 'testUserId0',
          firebaseUId: 'xxx',
          name: '水瀬 リエル',
        },
      });
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation Mutation($deleteUserId: String!) {
            deleteUser(id: $deleteUserId) {
              id
              name
            }
          }`,
          variables: {
            deleteUserId: 'testUserId0',
          },
        });
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.deleteUser.name).toBe('水瀬 リエル');
      // DBから消えているか
      const targetUser = await prisma.user.findUnique({
        where: {
          id: 'testUserId0',
        },
      });
      expect(targetUser).toBeNull();
    });
  });
});
