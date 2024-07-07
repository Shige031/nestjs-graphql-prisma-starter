import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { FindUserService } from 'src/user/service/findUser.service';
import { User } from '@prisma/client';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(private readonly findUserService: FindUserService) {
    super();
  }

  async validate(token: string): Promise<User> {
    try {
      const firebaseUser: DecodedIdToken = await admin
        .auth()
        .verifyIdToken(token);
      return this.findUserService.findByUId({ uid: firebaseUser.uid });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
