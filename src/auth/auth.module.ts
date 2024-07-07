import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, UserModule],
  providers: [FirebaseAuthStrategy, FirebaseAuthGuard],
})
export class AuthModule {}
